import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PlayerBoard, OpponentBoard, Boat } from "../../../swagger";

@Component({
  selector: "app-board-view",
  templateUrl: "./board-view.component.html",
  styleUrls: ["./board-view.component.css"]
})
export class BoardViewComponent implements OnInit {
  @Input()
  board: PlayerBoard | OpponentBoard;

  @Input()
  currentBoat?: Boat;

  @Output()
  action: EventEmitter<{
    x: number;
    y: number;
    i: number;
  }> = new EventEmitter();

  isBoat(type) {
    return (
      type === "Boat" ||
      type === "Destroyer" ||
      type === "Submarine" ||
      type === "Battleship" ||
      type === "AircraftCarrier"
    );
  }

  getRows<T extends object>(data: T[], width: number) {
    const rows: T[][] = [];

    let row: T[] = [];
    data.forEach((e: T, i) => {
      if (row.length >= width) {
        rows.push(row);
        row = [];
      }

      row.push(e);
    });
    rows.push(row);

    return rows;
  }

  constructor() {}

  ngOnInit() {}

  onAction(x, y) {
    this.action.emit({ x, y, i: x + y * this.board.width });
  }
}
