import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, timer } from "rxjs";
import { switchMap } from "rxjs/operators";

import { User, UsersService } from "../../../swagger";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-ingame",
  templateUrl: "./ingame.component.html",
  styleUrls: ["./ingame.component.css"]
})
export class IngameComponent implements OnInit {
  selectedUser: Observable<User>;
  userName: string;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private usersService: UsersService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.selectedUser = timer(0, 3000).pipe(
          switchMap(() => this.usersService.usersByIdIdGet(params.id))
        );
      }
    });

    this.userName = this.authService.getUserToken().id;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
