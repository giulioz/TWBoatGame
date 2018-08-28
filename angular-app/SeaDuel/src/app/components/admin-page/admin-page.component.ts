import { Component, OnInit } from "@angular/core";
import { UsersService, User } from "../../../swagger";

@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.css"]
})
export class AdminPageComponent implements OnInit {
  users: User[];

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    this.users = await this.usersService.usersGet().toPromise();
  }

  toggleAdmin(userId: string, admin: boolean) {
    const role = admin ? "user" : "administrator";
    this.usersService.usersByIdIdPut(userId, { role }).subscribe(async _ => {
      this.users = await this.usersService.usersGet().toPromise();
    });
  }

  delete(userId: string) {
    this.usersService.usersByIdIdDelete(userId).subscribe(async _ => {
      this.users = await this.usersService.usersGet().toPromise();
    });
  }
}
