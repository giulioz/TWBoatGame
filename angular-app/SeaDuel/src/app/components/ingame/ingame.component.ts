import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

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
  opponent: User;
  messages: Message[];
  game: Game;

  finds: User[];
  friends: User[];
  waiting: User[];
  top: User[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private gamesService: GamesService,
    private messaggingService: MessagingService,
    private eventsService: EventsService
  ) {}

  updateUser = async () => {
    if (this.opponentId) {
      this.opponent = await this.usersService
        .usersByIdIdGet(this.opponentId)
        .toPromise();
    }
  };

  updateMessages = async () => {
    if (this.opponentId) {
      this.messages = await this.messaggingService
        .usersByIdIdMessagesGet(this.opponentId)
        .toPromise();
    }
  };

  updateGame = async () => {
    if (this.opponentId) {
      this.game = await this.gamesService
        .usersByIdIdGameGet(this.opponentId)
        .toPromise();
    }
  };

  updateFriends = async () => {
    this.friends = await this.usersService.usersContactsGet().toPromise();
  };

  poolUserStats = async () => {
    this.waiting = await this.usersService.usersWaitingGet().toPromise();
    this.top = await this.usersService.usersTopGet().toPromise();
  };

  async ngOnInit() {
    this.currentUser = this.authService.getUserToken();
    this.currentUser = await this.usersService
      .usersByIdIdGet(this.authService.getUserToken().id)
      .toPromise();

    this.updateFriends();
    this.poolUserStats();

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
        this.updateFriends();
      } else if (event.type === EventType.IncomingMessage) {
        this.updateMessages();
        this.updateFriends();
      } else if (event.type === EventType.UserUpdate) {
        this.poolUserStats();
        this.updateUser();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  onFind = async (userId: string) => {
    if (userId && userId.length > 0) {
      this.finds = await this.usersService.usersFindIdIdGet(userId).toPromise();
    } else {
      this.finds = [];
    }
  };
}
