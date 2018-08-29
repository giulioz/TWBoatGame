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

  // TODO: move
  private boatSizes = {
    Destroyer: 2,
    Submarine: 3,
    Battleship: 4,
    AircraftCarrier: 5
  };

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

  ngOnInit() {
    if (this.currentBoat) {
      document.addEventListener("mousemove", ev => {
        const element = document.getElementById("current-boat");
        element.style.width =
          this.currentBoat.direction === "Horizontal"
            ? 22 * this.boatSizes[this.currentBoat.type] + "px"
            : "22px";
        element.style.height =
          this.currentBoat.direction === "Horizontal"
            ? "22px"
            : 22 * this.boatSizes[this.currentBoat.type] + "px";
        element.style.top = ev.pageY - 11 + "px";
        element.style.left = ev.pageX - 11 + "px";
      });
    }
  }

  onAction(x, y) {
    this.action.emit({ x, y, i: x + y * this.board.width });
  }
}
