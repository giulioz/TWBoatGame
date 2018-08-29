import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Game, GamesService, Boat } from "../../../swagger";

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
  needsGameUpdate: EventEmitter<any> = new EventEmitter();
  @Output()
  needsUserUpdate: EventEmitter<any> = new EventEmitter();

  @Input()
  buttonActive: boolean;
  @Input()
  buttonText: string;
  @Output()
  button: EventEmitter<any> = new EventEmitter();

  expectedBoats?: Boat[];

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
  currentBoat = () =>
    this.game.availableBoats.filter(boat => boat.amount > 0)[0];

  constructor(private gamesService: GamesService) {}

  ngOnInit() {}

  newGame = () => {
    this.gamesService.usersByIdIdGamePost(this.opponentId).subscribe(_ => {
      this.needsGameUpdate.emit();
    });
  };

  resignGame = () => {
    this.gamesService.usersByIdIdGameDelete(this.opponentId).subscribe(_ => {
      this.needsGameUpdate.emit();
      this.needsUserUpdate.emit();
    });
  };

  acceptGameRequest = () => {
    this.gamesService
      .usersByIdIdGamePut(this.opponentId)
      .subscribe(_ => this.needsGameUpdate.emit(), e => console.error(e));
  };

  rejectGameRequest = () => {
    this.gamesService
      .usersByIdIdGameDelete(this.opponentId)
      .subscribe(_ => this.needsGameUpdate.emit(), e => console.error(e));
  };

  positionAction = $event => {
    const nextBoat = this.currentBoat().type;

    this.gamesService
      .usersByIdIdGameBoatsPost(this.opponentId, {
        x: $event.x,
        y: $event.y,
        direction: "Vertical",
        type: nextBoat
      })
      .subscribe(_ => this.needsGameUpdate.emit(), e => console.error(e));
  };

  moveAction = $event => {
    this.gamesService
      .usersByIdIdGameMovesPost(this.opponentId, {
        x: $event.x,
        y: $event.y
      })
      .subscribe(_ => this.needsGameUpdate.emit(), e => console.error(e));
  };
}
