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
    width: board.width,
    height: board.height,
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

function swapPlayers(game: Game) {
  const state =
    game.state === GameStateType.PlayerTurn
      ? GameStateType.OpponentTurn
      : game.state === GameStateType.OpponentTurn
        ? GameStateType.PlayerTurn
        : game.state;

  return {
    ...game,
    state,
    playerId: game.opponentId,
    opponentId: game.playerId,
    playerBoard: game.opponentBoard,
    opponentBoard: game.playerBoard,
    playerReady: game.opponentReady,
    opponentReady: game.playerReady,
    playerAvailableBoats: game.opponentAvailableBoats
  };
}

function transformGamePlayer(game: Game, playerId: string) {
  const swapped = game.opponentId === playerId ? swapPlayers(game) : game;
  return {
    state:
      game.state === GameStateType.WaitingForResponse &&
      game.opponentId === playerId
        ? GameStateType.HasToRespond
        : swapped.state,
    winnerId: swapped.winnerId,
    playerBoard: swapped.playerBoard,
    opponentBoard: hideBoard(swapped.opponentBoard),
    playerReady: swapped.playerReady,
    opponentReady: swapped.opponentReady,
    startTime: swapped.startTime,
    availableBoats: swapped.playerAvailableBoats
  };
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

const emptyGame = (playerA: string, playerB: string) => ({
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

function boardAddBoat(
  board: GameBoard,
  type: BoardElementType,
  x: number,
  y: number,
  direction: "Vertical" | "Horizontal"
) {
  const newBoardData = [...board.boardData];

  const begin = [x, y];
  const end =
    direction === "Vertical"
      ? [x + 1, y + boatSizes[type]]
      : [x + boatSizes[type], y + 1];

  if (
    begin[0] >= 0 &&
    begin[0] < defaultWidth &&
    begin[1] >= 0 &&
    begin[1] < defaultHeight &&
    end[0] >= 0 &&
    end[0] < defaultWidth &&
    end[1] >= 0 &&
    end[1] < defaultHeight
  ) {
    for (let x = begin[0]; x < end[0]; x++) {
      for (let y = begin[1]; y < end[1]; y++) {
        // TODO: Boundary check
        if (newBoardData[x + y * board.width].type === "Empty") {
          newBoardData[x + y * board.width] = { type, checked: false };
        } else {
          return null;
        }
      }
    }
  } else {
    return null;
  }

  return {
    width: board.width,
    height: board.height,
    boardData: newBoardData
  };
}

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

  async fromPlayersAsPlayer(player: string, opponent: string): Promise<any> {
    const game =
      (await this.fromPlayers(player, opponent)) ||
      new GameModel(emptyGame(player, opponent));

    return transformGamePlayer(game, player);
  }

  async sendRequest(player: string, opponent: string): Promise<Game> {
    const prevGame = await this.fromPlayers(player, opponent);
    if (prevGame && prevGame.state !== GameStateType.Ended) {
      throw "Game not ended";
    }

    const game = new GameModel(emptyGame(player, opponent));
    game.state = GameStateType.WaitingForResponse;
    return game.save();
  }

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

  async addBoat(
    player: string,
    opponent: string,
    type: BoardElementType,
    x: number,
    y: number,
    direction: "Vertical" | "Horizontal"
  ): Promise<void> {
    const game = await this.fromPlayers(player, opponent);
    if (game.state !== GameStateType.BoatsPositioning) {
      throw "Invalid";
    }

    const isAvailable = availableBoats => {
      const foundIndex = availableBoats.findIndex(boat => boat.type === type);
      if (foundIndex < 0 || availableBoats[foundIndex].amount < 1) {
        throw "Unavailable";
      } else {
        return true;
      }
    };
    if (game.playerId === player) {
      isAvailable(game.playerAvailableBoats);
    } else {
      isAvailable(game.opponentAvailableBoats);
    }

    const newBoard = boardAddBoat(
      game.playerId === player ? game.playerBoard : game.opponentBoard,
      type,
      x,
      y,
      direction
    );

    if (!newBoard) {
      throw "Invalid";
    }

    const decrementAvailable = availableBoats => {
      const foundIndex = availableBoats.findIndex(boat => boat.type === type);
      if (foundIndex >= 0) {
        availableBoats[foundIndex].amount--;
      }
    };
    const isReady = (availableBoats: Boat[]) =>
      availableBoats.filter(a => a.amount > 0).length > 0;
    if (game.playerId === player) {
      decrementAvailable(game.playerAvailableBoats);
      if (isReady(game.playerAvailableBoats)) {
        game.playerReady = true;
      }
    } else {
      decrementAvailable(game.opponentAvailableBoats);
      if (isReady(game.opponentAvailableBoats)) {
        game.opponentReady = true;
      }
    }

    return GameModel.updateOne(
      {
        $or: [
          { playerId: player, opponentId: opponent },
          { playerId: opponent, opponentId: player }
        ]
      },
      game.playerId === player
        ? {
            playerBoard: newBoard,
            playerAvailableBoats: game.playerAvailableBoats,
            playerReady: game.playerReady
          }
        : {
            opponentBoard: newBoard,
            opponentAvailableBoats: game.opponentAvailableBoats,
            opponentReady: game.opponentReady
          }
    );
  }

  async doMove(
    player: string,
    opponent: string,
    x: number,
    y: number
  ): Promise<void> {
    const doMoveBoard = (board: GameBoard) => {
      const i = x + y * board.width;
      if (!board.boardData[i].checked) {
        board.boardData[i].checked = true;
      }
    };

    const checkVictory = (board: GameBoard) =>
      board.boardData.filter(
        cell => !cell.checked && cell.type !== BoardElementType.Empty
      ).length > 0;

    const game = await this.fromPlayers(player, opponent);
    if (game.playerId === player) {
      if (game.state !== GameStateType.PlayerTurn) {
        throw "Invalid";
      }

      doMoveBoard(game.opponentBoard);
      if (checkVictory(game.opponentBoard)) {
        game.state = GameStateType.Ended;
      } else {
        game.state = GameStateType.OpponentTurn;
      }

      return GameModel.updateOne(
        {
          $or: [
            { playerId: player, opponentId: opponent },
            { playerId: opponent, opponentId: player }
          ]
        },
        {
          opponentBoard: game.opponentBoard,
          state: game.state
        }
      );
    } else {
      if (game.state !== GameStateType.OpponentTurn) {
        throw "Invalid";
      }

      doMoveBoard(game.playerBoard);
      if (checkVictory(game.playerBoard)) {
        game.state = GameStateType.Ended;
      } else {
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
          playerBoard: game.playerBoard,
          state: game.state
        }
      );
    }
  }
}

export default GamesService;
