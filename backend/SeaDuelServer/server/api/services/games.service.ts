import { DateTime } from "luxon";
import { UsersService } from "./users.service";

type BoardElementType =
  | "Empty"
  | "Destroyer"
  | "Submarine"
  | "Battleship"
  | "AircraftCarrier"
  | "Hidden";

export interface BoardElement {
  type: BoardElementType;
  checked: boolean;
}

export interface GameBoard {
  boardData: BoardElement[][];
  width: number;
  height: number;
}

type GameStateType =
  | "WaitingForResponse"
  | "Rejected"
  | "BoatsPositioning"
  | "PlayerTurn"
  | "OpponentTurn"
  | "Ended";

export interface Game {
  state: GameStateType;
  playerId: string;
  opponentId: string;
  winnerId: string;
  playerBoard: GameBoard;
  opponentBoard: GameBoard;
  startTime: DateTime;
}

function hideBoard(board: GameBoard): GameBoard {
  return {
    ...board,
    boardData: board.boardData.map(col =>
      col.map(
        cell =>
          cell.checked ? cell : { ...cell, type: "Hidden" as BoardElementType }
      )
    )
  };
}

function swapPlayers(game: Game): Game {
  const state =
    game.state === "PlayerTurn"
      ? "OpponentTurn"
      : game.state === "OpponentTurn"
        ? "PlayerTurn"
        : game.state;

  return {
    ...game,
    state,
    playerId: game.opponentId,
    opponentId: game.playerId,
    playerBoard: game.opponentBoard,
    opponentBoard: game.playerBoard
  };
}

function transformGamePlayer(game: Game, playerId: string): Game {
  const swapped = game.opponentId === playerId ? swapPlayers(game) : game;
  return {
    ...swapped,
    opponentBoard: hideBoard(swapped.opponentBoard)
  };
}

const defaultWidth = 10;
const defaultHeight = 10;

const emptyGameBoard = (width: number, height: number): GameBoard => ({
  width,
  height,
  boardData: new Array(width)
    .fill([])
    .map(_ =>
      new Array(height)
        .fill({})
        .map(_ => ({ type: "Empty" as BoardElementType, checked: false }))
    )
});

const emptyGame = (playerA: string, playerB: string): Game => ({
  state: "Ended",
  playerId: playerA,
  opponentId: playerB,
  winnerId: "",
  playerBoard: emptyGameBoard(defaultWidth, defaultHeight),
  opponentBoard: emptyGameBoard(defaultWidth, defaultHeight),
  startTime: DateTime.local()
});

// TODO: persistance
const games: Game[] = [];

export class GamesService {
  constructor () { }

  async all(): Promise<Game[]> {
    return games;
  }

  async fromPlayers(playerA: string, playerB: string): Promise<Game> {
    const game = games.find(
      game =>
        (game.playerId === playerA && game.opponentId === playerB) ||
        (game.playerId === playerB && game.opponentId === playerA)
    );
    return game || emptyGame(playerA, playerB);
  }

  async fromPlayersAsPlayer(player: string, opponent: string): Promise<Game> {
    const game = await this.fromPlayers(player, opponent);
    return transformGamePlayer(game, player);
  }

  async startNew(player: string, opponent: string) : Promise<Game> {
    return null;
  }

  async resign(player: string, opponent: string) : Promise<Game> {
    return null;
  }
}

export default GamesService;
