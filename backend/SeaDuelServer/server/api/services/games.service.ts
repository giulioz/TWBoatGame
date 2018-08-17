import { DateTime } from "luxon";
import { UsersService } from "./users.service";
import { GameBoard, Game, BoardElementType, GameModel, GameBoardModel, BoardElement } from "./db.service";

function hideBoard(board: GameBoard): GameBoard {
  return new GameBoardModel({
    ...board,
    boardData: board.boardData.map(col =>
      col.map(
        cell =>
          (cell as BoardElement).checked ? cell : { ...cell, type: "Hidden" as BoardElementType }
      )
    )
  });
}

function swapPlayers(game: Game): Game {
  const state =
    game.state === "PlayerTurn"
      ? "OpponentTurn"
      : game.state === "OpponentTurn"
        ? "PlayerTurn"
        : game.state;

  return new GameModel({
    ...game,
    state,
    playerId: game.opponentId,
    opponentId: game.playerId,
    playerBoard: game.opponentBoard,
    opponentBoard: game.playerBoard
  });
}

function transformGamePlayer(game: Game, playerId: string): Game {
  const swapped = game.opponentId === playerId ? swapPlayers(game) : game;
  return new GameModel({
    ...swapped,
    opponentBoard: hideBoard(swapped.opponentBoard as GameBoard)
  });
}

const defaultWidth = 10;
const defaultHeight = 10;

const emptyGameBoard = (width: number, height: number): GameBoard => new GameBoardModel({
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

const emptyGame = (playerA: string, playerB: string): Game => new GameModel({
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
