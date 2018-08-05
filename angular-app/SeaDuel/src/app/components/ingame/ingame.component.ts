import { Component, OnInit } from "@angular/core";
import { DateTime } from "luxon";

import { User, UserType, UserState } from "../../models/user";

@Component({
  selector: "app-ingame",
  templateUrl: "./ingame.component.html",
  styleUrls: ["./ingame.component.css"]
})
export class IngameComponent implements OnInit {
  testUsers: User[] = [
    new User(
      "giulioz",
      "",
      "",
      UserType.User,
      UserState.Online,
      [],
      [],
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
  ];

  ngOnInit() {}
}
