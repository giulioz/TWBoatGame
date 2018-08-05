export enum BoardElementType {
  Empty,
  Destroyer,
  Submarine,
  Battleship,
  AircraftCarrier
}

export interface IBoardElement {
  type: BoardElementType;
  checked: boolean;
}

export class GameBoard {
  constructor(
    public boardData: IBoardElement[][],
    public width: number = 10,
    public height: number = 10
  ) {}
}
