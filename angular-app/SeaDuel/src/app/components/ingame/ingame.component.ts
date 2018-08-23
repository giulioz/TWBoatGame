import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, timer } from "rxjs";
import { switchMap } from "rxjs/operators";

import { User, UsersService, Game, GamesService } from "../../../swagger";
import { AuthService } from "../../services/auth.service";
import { EventsService, EventType } from "../../services/events.service";

@Component({
  selector: "app-ingame",
  templateUrl: "./ingame.component.html",
  styleUrls: ["./ingame.component.css"]
})
export class IngameComponent implements OnInit {
  currentUser: User;
  opponentId?: string;
  opponent: Observable<User>;
  game: Observable<Game>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private gamesService: GamesService,
    private eventsService: EventsService
  ) {}

  updateGame = () => {
    this.game = this.gamesService.usersByIdIdGameGet(this.opponentId);

    // this.game.subscribe(next => {
    //   next.state ===
    // })
  };

  async ngOnInit() {
    this.currentUser = this.authService.getUserToken();

    this.route.params.subscribe(async params => {
      this.opponentId = params.id;

      if (this.opponentId) {
        this.updateGame();

        this.opponent = timer(0, 3000).pipe(
          switchMap(() => this.usersService.usersByIdIdGet(params.id))
        );
      }
    });

    const eventStream = await this.eventsService.getEvents();
    eventStream.subscribe(event => {
      if (event.type === EventType.GameChanged) {
        this.updateGame();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  onStartGame() {}
}
