import { DateTime } from "luxon";
import {
  GameBoard,
  Game,
  BoardElementType,
  GameModel,
  GameBoardModel,
  BoardElement,
  GameStateType
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

function hideBoard(board: GameBoard): GameBoard {
  return new GameBoardModel({
    ...board,
    boardData: board.boardData.map(col =>
      col.map(
        cell =>
          (cell as BoardElement).checked
            ? cell
            : { ...cell, type: BoardElementType.Hidden }
      )
    )
  });
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
    opponentReady: game.playerReady
  });
}

function transformGamePlayer(game: Game, playerId: string): Game {
  const swapped = game.opponentId === playerId ? swapPlayers(game) : game;
  return new GameModel({
    ...swapped,
    opponentBoard: hideBoard(swapped.opponentBoard as GameBoard)
  });
}

const emptyGameBoard = (width: number, height: number): GameBoard =>
  new GameBoardModel({
    width,
    height,
    boardData: new Array(width)
      .fill([])
      .map(_ =>
        new Array(height)
          .fill({})
          .map(_ => ({ type: BoardElementType.Empty, checked: false }))
      )
  });

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
    startTime: DateTime.local().toISO()
  });

export class GamesService {
  constructor(private userService: UsersService) {}

  async all(): Promise<Game[]> {
    const query = GameModel.find();
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
    const game = await this.fromPlayers(player, opponent);
    return transformGamePlayer(game, player);
  }

  async sendRequest(player: string, opponent: string): Promise<Game> {
    // RESIGN: other player wins and resigning player loses, then delete old game
    const prevGame = await this.fromPlayers(player, opponent);
    if (prevGame.state !== GameStateType.Ended) {
      await this.userService.incrementStats(player, 0, 1);
      await this.userService.incrementStats(opponent, 1, 0);
      const deleteQuery = GameModel.deleteOne({
        $or: [
          { playerId: player, opponentId: opponent },
          { playerId: opponent, opponentId: player }
        ]
      });
      await deleteQuery.exec();
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

  async resign(player: string, opponent: string): Promise<Game> {
    // GameModel.deleteOne()
    return null;
  }
}

export default GamesService;
