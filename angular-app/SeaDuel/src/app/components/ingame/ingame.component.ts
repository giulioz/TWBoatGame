import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, timer } from "rxjs";
import { switchMap } from "rxjs/operators";

import {
  User,
  UsersService,
  Game,
  GamesService,
  Message,
  MessagingService
} from "../../../swagger";
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
  messages: Observable<Message[]>;
  game: Observable<Game>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private gamesService: GamesService,
    private messaggingService: MessagingService,
    private eventsService: EventsService
  ) {}

  updateUser = () => {
    this.opponent = this.usersService.usersByIdIdGet(this.opponentId);
  };

  updateMessages = () => {
    this.messages = this.messaggingService.usersByIdIdMessagesGet(
      this.opponentId
    );
  };

  updateGame = () => {
    this.game = this.gamesService.usersByIdIdGameGet(this.opponentId);
  };

  ngOnInit() {
    this.currentUser = this.authService.getUserToken();

    this.route.params.subscribe(params => {
      this.opponentId = params.id;

      if (this.opponentId) {
        this.updateUser();
        this.updateMessages();
        this.updateGame();
      }
    });

    const eventStream = this.eventsService.getEvents();
    eventStream.subscribe(event => {
      if (event.type === EventType.GameChanged) {
        this.updateGame();
      } else if (event.type === EventType.IncomingMessage) {
        this.updateMessages();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  onStartGame() {}
}
