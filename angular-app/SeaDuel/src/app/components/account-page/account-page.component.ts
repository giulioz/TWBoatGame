import { Component, OnInit } from "@angular/core";
import { User, UsersService } from "../../../swagger";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-account-page",
  templateUrl: "./account-page.component.html",
  styleUrls: ["./account-page.component.css"]
})
export class AccountPageComponent implements OnInit {
  userId?: string;
  user: User;

  constructor(private router: Router, public usersService: UsersService, public authService: AuthService) {}

  async ngOnInit() {
    this.userId = this.authService.getUserToken().id;
    this.user = await (this.usersService.usersByIdIdGet(this.userId).toPromise());
  }

  async onSubmit() {
    await this.usersService.usersByIdIdPut(this.userId, this.user);
    this.router.navigate(["/ingame"]);
  }

  async onDelete() {
    await this.usersService.usersByIdIdDelete(this.userId);
    this.router.navigate(["/ingame"]);
  }
}
