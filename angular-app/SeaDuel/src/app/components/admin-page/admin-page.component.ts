import { Component, OnInit } from "@angular/core";
import { UsersService, User } from "../../../swagger";
import { Observable } from "../../../../node_modules/rxjs";

@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.css"]
})
export class AdminPageComponent implements OnInit {
  users: Observable<User[]>;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.users = this.usersService.usersGet();
  }

  toggleAdmin(userId: string, admin: boolean) {
    const role = admin ? "user" : "administrator";
    this.usersService.usersByIdIdPut(userId, { role }).subscribe(_ => {
      this.users = this.usersService.usersGet();
    });
  }

  delete(userId: string) {
    this.usersService.usersByIdIdDelete(userId).subscribe(_ => {
      this.users = this.usersService.usersGet();
    });
  }
}
