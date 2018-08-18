import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

import { User, UsersService } from "../../../swagger";

@Component({
  selector: "app-ingame",
  templateUrl: "./ingame.component.html",
  styleUrls: ["./ingame.component.css"]
})
export class IngameComponent implements OnInit {
  selectedUserId: string;
  selectedUser: Observable<User>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.selectedUserId = params.id;
        this.selectedUser = this.userService.usersByIdIdGet(params.id);
      }
    });
  }

  ngOnInit() {}
}
