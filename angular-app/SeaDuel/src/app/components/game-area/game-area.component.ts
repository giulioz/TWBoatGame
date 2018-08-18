import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-game-area",
  templateUrl: "./game-area.component.html",
  styleUrls: ["./game-area.component.css"]
})
export class GameAreaComponent implements OnInit {
  @Input()
  userId: string;

  constructor() {}

  ngOnInit() {}
}
