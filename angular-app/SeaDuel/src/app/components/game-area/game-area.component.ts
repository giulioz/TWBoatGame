import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Game, GamesService } from "../../../swagger";

@Component({
  selector: "app-game-area",
  templateUrl: "./game-area.component.html",
  styleUrls: ["./game-area.component.css"]
})
export class GameAreaComponent implements OnInit {
  @Input()
  opponentId: string;

  @Input()
  game: Game;

  @Output()
  needsUpdate: EventEmitter<any> = new EventEmitter();

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
    } else if (game.state === "Ended") {
      if (game.winnerId === game.playerId) {
        return "Won";
      } else if (game.winnerId === game.opponentId) {
        return "Lost";
      } else {
        return "Ended";
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
      .subscribe(_ => this.needsUpdate.emit(), e => console.error(e));
  };

  rejectGameRequest = () => {
    this.gamesService
      .usersByIdIdGameDelete(this.opponentId)
      .subscribe(_ => this.needsUpdate.emit(), e => console.error(e));
  };

  positionAction = $event => {
    const nextBoat = this.game.availableBoats.filter(boat => boat.amount > 0)[0]
      .type;

    this.gamesService
      .usersByIdIdGameBoatsPost(this.opponentId, {
        x: $event.x,
        y: $event.y,
        direction: "Vertical",
        type: nextBoat
      })
      .subscribe(_ => this.needsUpdate.emit(), e => console.error(e));
  };

  moveAction = $event => {
    this.gamesService
      .usersByIdIdGameMovesPost(this.opponentId, {
        x: $event.x,
        y: $event.y
      })
      .subscribe(_ => this.needsUpdate.emit(), e => console.error(e));
  };
}
