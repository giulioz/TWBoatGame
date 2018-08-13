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
    // this._currentUser.next(
    //   new User(
    //     "giulioz",
    //     "mail.zausa.giulio@gmail.com",
    //     "",
    //     UserType.User,
    //     DateTime.local(),
    //     UserState.Online,
    //     [
    //       new User(
    //         "testUser",
    //         "",
    //         "",
    //         UserType.User,
    //         DateTime.local(),
    //         UserState.Online,
    //         [],
    //         [
    //           new Message(
    //             "testUser",
    //             "giulioz",
    //             "Hey Ciao!",
    //             DateTime.local(),
    //             false
    //           )
    //         ],
    //         true,
    //         [],
    //         false,
    //         12,
    //         3,
    //         15,
    //         12
    //       ),
    //       new User(
    //         "AlessioMarotta",
    //         "",
    //         "",
    //         UserType.User,
    //         DateTime.local(),
    //         UserState.Offline,
    //         [],
    //         [],
    //         false,
    //         [],
    //         false,
    //         12,
    //         3,
    //         15,
    //         3
    //       ),
    //       new User(
    //         "Sunnix",
    //         "",
    //         "",
    //         UserType.User,
    //         DateTime.local(),
    //         UserState.Playing,
    //         [],
    //         [],
    //         false,
    //         [],
    //         false,
    //         12,
    //         3,
    //         15,
    //         5
    //       )
    //     ],
    //     [],true,
    //     [],false,
    //     13,
    //     0,
    //     4,
    //     13
    //   )
    // );
  }
}
