import { Component, OnInit, Input } from "@angular/core";
import { Game, GamesService, UsersService } from "../../../swagger";
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
    if (game.state === "Ended") {
      return "Ended";
    } else if (game.state === "WaitingForResponse") {
      return "WaitingForResponse";
    } else if (game.state === "BoatsPositioning") {
      if (!game.playerReady) {
        return "PlayerToPosition";
      } else {
        
      }
      return "BoatsPositioning";
    }
  }

  constructor(private gamesService: GamesService) {}

  ngOnInit() {}
}
