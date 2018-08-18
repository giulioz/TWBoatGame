import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { User, UsersService } from "../../../swagger";

@Component({
  selector: "app-ingame",
  templateUrl: "./ingame.component.html",
  styleUrls: ["./ingame.component.css"]
})
export class IngameComponent implements OnInit {
  selectedUserId: string;
  selectedUser: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {
    this.route.params.subscribe(params => {
      this.selectedUserId = params.id;
      this.selectedUser = null;
    });
  }

  ngOnInit() {}
}
