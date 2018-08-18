import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, timer } from "rxjs";
import { switchMap } from "rxjs/operators";

import { User, UsersService } from "../../../swagger";

@Component({
  selector: "app-ingame",
  templateUrl: "./ingame.component.html",
  styleUrls: ["./ingame.component.css"]
})
export class IngameComponent implements OnInit {
  selectedUser: Observable<User>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.selectedUser = timer(0, 3000).pipe(
          switchMap(() => this.usersService.usersByIdIdGet(params.id))
        );
      }
    });
  }

  ngOnInit() {}
}
