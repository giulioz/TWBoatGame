export enum BoardElementType {
  Empty,
  Destroyer,
  Submarine,
  Battleship,
  AircraftCarrier
}

export interface BoardElement {
  type: BoardElementType;
  checked: boolean;
}

export class GameBoard {
  constructor(
    public boardData: BoardElement[][],
    public width: number = 10,
    public height: number = 10
  ) {}
}
