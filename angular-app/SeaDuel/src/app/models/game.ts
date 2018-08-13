import { GameBoard } from "./gameboard";

export enum GameState {
  WaitingForResponse,
  Rejected,
  BoatsPositioning,
  InitiatorTurn,
  OpponentTurn,
  Ended
}

export class Game {
  constructor(
    public gameId: string,
    public initiatorId: string,
    public opponentId: string,
    public state: GameState,
    public winnerId: string,
    public initiatorBoard: GameBoard,
    public opponentBoard: GameBoard
  ) {}
}
