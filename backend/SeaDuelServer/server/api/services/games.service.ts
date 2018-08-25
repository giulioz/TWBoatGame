import { DateTime } from "luxon";
import {
  GameBoard,
  Game,
  BoardElementType,
  GameModel,
  BoardElement,
  GameStateType,
  Boat
} from "./db.service";
import UsersService from "./users.service";

// Settings
const defaultWidth = 10;
const defaultHeight = 10;
const boatSizes = {
  Destroyer: 2,
  Submarine: 3,
  Battleship: 4,
  AircraftCarrier: 5
};

function isFullBoatDrown(board: GameBoard, x: number, y: number) {
  // TODO
  return false;
}

function hideBoard(board: GameBoard) {
  return {
    ...board,
    boardData: board.boardData.map(
      (cell: BoardElement, i) =>
        cell.checked
          ? {
              type:
                cell.type === BoardElementType.Empty
                  ? "Miss"
                  : isFullBoatDrown(board, i % board.width, i / board.width)
                    ? "Boat"
                    : "Hit"
            }
          : { type: "Unknown" }
    )
  };
}

function swapPlayers(game: Game): Game {
  const state =
    game.state === GameStateType.PlayerTurn
      ? GameStateType.OpponentTurn
      : game.state === GameStateType.OpponentTurn
        ? GameStateType.PlayerTurn
        : game.state;

  return new GameModel({
    ...game,
    state,
    playerId: game.opponentId,
    opponentId: game.playerId,
    playerBoard: game.opponentBoard,
    opponentBoard: game.playerBoard,
    playerReady: game.opponentReady,
    opponentReady: game.playerReady,
    playerAvailableBoats: game.opponentAvailableBoats
  });
}

function transformGamePlayer(game: Game, playerId: string): Game {
  const swapped = game.opponentId === playerId ? swapPlayers(game) : game;
  console.log(swapped);
  return new GameModel({
    ...swapped,
    ...(swapped as any)._doc,
    opponentBoard: hideBoard(swapped.opponentBoard as GameBoard),
    opponentAvailableBoats: []
  });
}

const emptyGameBoard = (width: number, height: number): GameBoard => ({
  width,
  height,
  boardData: new Array(width * height)
    .fill(0)
    .map(_ => ({ type: BoardElementType.Empty, checked: false }))
});

const initialBoats: Boat[] = [
  { type: BoardElementType.Destroyer, amount: 4 },
  { type: BoardElementType.Submarine, amount: 2 },
  { type: BoardElementType.Battleship, amount: 2 },
  { type: BoardElementType.AircraftCarrier, amount: 1 }
];

const emptyGame = (playerA: string, playerB: string) =>
  new GameModel({
    state: GameStateType.Ended,
    playerId: playerA,
    opponentId: playerB,
    winnerId: null,
    playerBoard: emptyGameBoard(defaultWidth, defaultHeight),
    opponentBoard: emptyGameBoard(defaultWidth, defaultHeight),
    playerReady: false,
    opponentReady: false,
    startTime: DateTime.local().toISO(),
    playerAvailableBoats: [...initialBoats],
    opponentAvailableBoats: [...initialBoats]
  });

export class GamesService {
  constructor(private userService: UsersService) {}

  async all(): Promise<Game[]> {
    const query = GameModel.find();
    return query.exec();
  }

  async fromPlayer(player: string): Promise<Game[]> {
    const query = GameModel.find({
      $or: [{ playerId: player }, { opponentId: player }]
    });
    return query.exec();
  }

  async fromPlayers(playerA: string, playerB: string): Promise<Game> {
    const query = GameModel.findOne({
      $or: [
        { playerId: playerA, opponentId: playerB },
        { playerId: playerB, opponentId: playerA }
      ]
    });
    return query.exec();
  }

  async fromPlayersAsPlayer(player: string, opponent: string): Promise<Game> {
    const game =
      (await this.fromPlayers(player, opponent)) || emptyGame(player, opponent);

    return transformGamePlayer(game, player);
  }

  async sendRequest(player: string, opponent: string): Promise<Game> {
    const prevGame = await this.fromPlayers(player, opponent);
    if (prevGame && prevGame.state !== GameStateType.Ended) {
      throw "Game not ended";
    }

    const game = emptyGame(player, opponent);
    game.state = GameStateType.WaitingForResponse;
    return game.save();
  }

  // async addBoat(
  //   player: string,
  //   opponent: string,
  //   boatType: BoardElementType,
  //   orientation: "vertical" | "horizontal",
  //   x: number,
  //   y: number
  // ): Promise<Game> {
  //   const game = await this.fromPlayers(player, opponent);

  //   const begin = [x, y];
  //   const end =
  //     orientation === "vertical"
  //       ? [x, y + boatSizes[boatType]]
  //       : [x + boatSizes[boatType], y];

  //   if (
  //     begin[0] >= 0 &&
  //     begin[0] < defaultWidth &&
  //     begin[1] >= 0 &&
  //     begin[1] < defaultHeight &&
  //     end[0] >= 0 &&
  //     end[0] < defaultWidth &&
  //     end[1] >= 0 &&
  //     end[1] < defaultHeight
  //   ) {
  //     for (let x = begin[0]; x < end[0]; x++) {
  //       for (let y = begin[1]; y < end[1]; y++) {
  //         game.playerBoard;
  //       }
  //     }
  //   }

  //   return GameModel.updateOne(
  //     {
  //       $or: [
  //         { playerId: player, opponentId: opponent },
  //         { playerId: opponent, opponentId: player }
  //       ]
  //     },
  //     game
  //   );
  // }

  async resign(player: string, opponent: string): Promise<void> {
    const game = await this.fromPlayers(player, opponent);
    if (
      game.state === GameStateType.BoatsPositioning ||
      game.state === GameStateType.OpponentTurn ||
      game.state === GameStateType.PlayerTurn
    ) {
      await this.userService.incrementStats(player, 0, 1);
      await this.userService.incrementStats(opponent, 1, 0);
    }
    const deleteQuery = GameModel.deleteOne({
      $or: [
        { playerId: player, opponentId: opponent },
        { playerId: opponent, opponentId: player }
      ]
    });
    await deleteQuery.exec();
  }

  async acceptGame(player: string, opponent: string): Promise<void> {
    const game = await this.fromPlayers(player, opponent);
    if (
      game.state !== GameStateType.WaitingForResponse ||
      game.opponentId !== player
    ) {
      throw "Invalid";
    }

    return GameModel.updateOne(
      {
        $or: [
          { playerId: player, opponentId: opponent },
          { playerId: opponent, opponentId: player }
        ]
      },
      {
        state: GameStateType.BoatsPositioning
      }
    ).exec();
  }

  async playerReady(player: string, opponent: string): Promise<void> {
    const game = await this.fromPlayers(player, opponent);
    if (game.state !== GameStateType.BoatsPositioning) {
      throw "Invalid";
    }

    if (game.playerId === player) {
      game.playerReady = true;
    } else {
      game.opponentReady = true;
    }

    if (game.playerReady && game.opponentReady) {
      game.state = GameStateType.PlayerTurn;
    }

    return GameModel.updateOne(
      {
        $or: [
          { playerId: player, opponentId: opponent },
          { playerId: opponent, opponentId: player }
        ]
      },
      {
        playerReady: game.playerReady,
        opponentReady: game.opponentReady,
        state: game.state
      }
    ).exec();
  }
}

export default GamesService;
