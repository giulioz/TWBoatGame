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

  currentState = (game: Game) => (game ? game.state : "");

  constructor(private gamesService: GamesService) {}

  ngOnInit() {}
}
