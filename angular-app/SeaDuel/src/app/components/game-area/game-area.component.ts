import { Component, OnInit, Input } from "@angular/core";
import { Game, GamesService, Boat } from "../../../swagger";
import { Observable } from "rxjs";

@Component({
  selector: "app-game-area",
  templateUrl: "./game-area.component.html",
  styleUrls: ["./game-area.component.css"]
})
export class GameAreaComponent implements OnInit {
  @Input()
  opponentId: string;

  @Input()
  game: Observable<Game>;

  initialBoats: Boat[] = [
    { type: "Destroyer" },
    { type: "Destroyer" },
    { type: "Destroyer" },
    { type: "Destroyer" },
    { type: "Submarine" },
    { type: "Submarine" },
    { type: "Battleship" },
    { type: "Battleship" },
    { type: "AircraftCarrier" }
  ];

  currentState = (game: Game) => {
    if (!game) {
      return "";
    }

    if (game.state === "BoatsPositioning") {
      if (!game.playerReady) {
        return "PlayerToPosition";
      } else {
        return "OpponentToPosition";
      }
    } else {
      return game.state;
    }
  };

  playerBoard = (game: Game) => (game ? game.playerBoard : null);
  opponentBoard = (game: Game) => (game ? game.opponentBoard : null);

  constructor(private gamesService: GamesService) {}

  ngOnInit() {}

  acceptGameRequest = () => {
    this.gamesService
      .usersByIdIdGamePut(this.opponentId)
      .subscribe({ error: e => console.error(e) });
  };

  rejectGameRequest = () => {
    this.gamesService
      .usersByIdIdGameDelete(this.opponentId)
      .subscribe({ error: e => console.error(e) });
  };

  positionAction = $event => {
    this.gamesService
      .usersByIdIdGameBoatsPost(this.opponentId, {
        x: $event.x,
        y: $event.y,
        direction: "Vertical",
        type: "Submarine"
      })
      .subscribe({ error: e => console.error(e) });
  };
}
