import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DateTime } from "luxon";

import { User, UserType, UserState } from "../models/user";
import { AuthService } from "../services/auth.service";
import { Message } from "../models/message";

@Injectable()
export class UserStore {
  constructor(private authService: AuthService) {
    this.loadInitialData();
  }

  private _currentUser: BehaviorSubject<User> = new BehaviorSubject(null);

  get currentUser() {
    return this._currentUser.asObservable();
  }

  loadInitialData() {
    this._currentUser.next(
      new User(
        "giulioz",
        "mail.zausa.giulio@gmail.com",
        "",
        UserType.User,
        UserState.Online,
        [
          new User(
            "testUser",
            "",
            "",
            UserType.User,
            UserState.Online,
            [],
            [new Message("testUser", "giulioz", "Hey Ciao!", DateTime.local(), false)],
            [],
            12,
            3,
            15,
            DateTime.local()
          ),
          new User(
            "AlessioMarotta",
            "",
            "",
            UserType.User,
            UserState.Offline,
            [],
            [],
            [],
            12,
            3,
            15,
            DateTime.local()
          ),
          new User(
            "Sunnix",
            "",
            "",
            UserType.User,
            UserState.Playing,
            [],
            [],
            [],
            12,
            3,
            15,
            DateTime.local()
          )
        ],
        [],
        [],
        13,
        0,
        13
      )
    );
  }
}
