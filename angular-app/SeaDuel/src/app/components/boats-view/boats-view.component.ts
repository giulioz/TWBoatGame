import { Component, OnInit, Input } from "@angular/core";
import {
  Game,
  PlayerBoardBoardData,
  OpponentBoardBoardData,
  PlayerBoard,
  OpponentBoard,
  Boat
} from "../../../swagger";

// TODO: move
const boatSizes = {
  Destroyer: 2,
  Submarine: 3,
  Battleship: 4,
  AircraftCarrier: 5
};

function isFullBoatDrown(board, px: number, py: number, checkChecked: boolean) {
  const boardXY = (x: number, y: number) =>
    board.boardData[x + y * board.width];
  const initialCell = boardXY(px, py);
  const recurse = (
    x: number,
    y: number,
    direction: "Left" | "Down" | "Right" | "Up"
  ) => {
    if (x < 0 || x >= board.width || y < 0 || y >= board.height) {
      return 0;
    } else {
      const currentCell = boardXY(x, y);
      if (
        currentCell &&
        (!checkChecked || currentCell.checked) &&
        currentCell.type === initialCell.type
      ) {
        if (direction === "Left") {
          return 1 + recurse(x + 1, y, direction);
        } else if (direction === "Down") {
          return 1 + recurse(x, y + 1, direction);
        } else if (direction === "Right") {
          return 1 + recurse(x - 1, y, direction);
        } else if (direction === "Up") {
          return 1 + recurse(x, y - 1, direction);
        }
      } else {
        return 0;
      }
    }
  };
  const initialValid = initialCell && (!checkChecked || initialCell.checked);
  const recHorizontal =
    recurse(px + 1, py, "Left") + recurse(px - 1, py, "Right");
  const recVertical = recurse(px, py + 1, "Down") + recurse(px, py - 1, "Up");
  return (
    initialValid &&
    (recHorizontal + 1 === boatSizes[initialCell.type] ||
      recVertical + 1 === boatSizes[initialCell.type])
  );
}

function isNext(
  cellA: { x: number; y: number },
  cellB: { x: number; y: number }
) {
  const distanceSquared = (
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
  return cellA && cellB && distanceSquared(cellA, cellB) <= 2;
}

@Component({
  selector: "app-boats-view",
  templateUrl: "./boats-view.component.html",
  styleUrls: ["./boats-view.component.css"]
})
export class BoatsViewComponent implements OnInit {
  @Input()
  game: Game;

  @Input()
  board?: PlayerBoard | OpponentBoard;

  @Input()
  mode?: string;

  private getBoats = () =>
    this.mode === "positioning"
      ? this.getPositionedBoats(this.game)
      : this.getSunkenBoats(this.game, this.board);

  private range = <T>(i: number, obj: T) =>
    new Array(i).fill(null).map(_ => obj);

  private isOpponentBoard = board =>
    board.boardData.filter(
      cell =>
        cell.type === "Unknown" || cell.type === "Hit" || cell.type === "Miss"
    ).length > 0;

  private getSunkenBoats = (game: Game, board) => {
    const isBoat = (cell: PlayerBoardBoardData | OpponentBoardBoardData) =>
      cell.type === "AircraftCarrier" ||
      cell.type === "Battleship" ||
      cell.type === "Destroyer" ||
      cell.type === "Submarine";

    const opponentBoard = this.isOpponentBoard(board);

    const sunken: Array<
      PlayerBoardBoardData & OpponentBoardBoardData
    > = board.boardData
      .map((cell, i) => ({
        x: i % board.width,
        y: Math.floor(i / board.width),
        ...cell
      }))
      .filter(
        cell =>
          isBoat(cell) && isFullBoatDrown(board, cell.x, cell.y, !opponentBoard)
      );

    return game.availableBoats
      .map(avBoat => ({
        expected: avBoat.amount,
        sunken: sunken.filter(b => b.type === avBoat.type).length / boatSizes[avBoat.type],
        length: boatSizes[avBoat.type],
        type: avBoat.type
      }))
      .map(boatType => {
        if (boatType.expected - boatType.sunken < 0) {
          throw new Error(JSON.stringify(boatType));
        }

        return [
          ...new Array(boatType.sunken).fill(null).map(_ => ({
            length: boatType.length,
            sunken: true
          })),
          ...new Array(boatType.expected - boatType.sunken)
            .fill(null)
            .map(_ => ({
              length: boatType.length,
              sunken: false
            }))
        ];
      })
      .reduce((run, current) => [...run, ...current]);
  };

  private getPositionedBoats = (game: Game) => {
    return game.availableBoats
      .map(boatType => [
        ...new Array(boatType.amount).fill(null).map(_ => ({
          length: boatSizes[boatType.type],
          sunken: false
        }))
      ])
      .reduce((run, current) => [...run, ...current]);
  };

  constructor() {}

  ngOnInit() {}
}
