import { Component, OnInit, Input } from "@angular/core";
import { Game, GamesService } from "../../../swagger";
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

  currentState(game: Game) {
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
  }

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
}
