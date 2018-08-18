import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { User, UsersService } from "../../../swagger";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  @ViewChild("waitingTab")
  waitingTab;
  @ViewChild("friendsTab")
  friendsTab;
  @ViewChild("scoreTab")
  scoreTab;

  friends: Observable<User[]>;
  waiting: Observable<User[]>;
  top: Observable<User[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {}

  // ************************************
  //  Collapse

  openWaiting = () => {
    this.waitingTab.open = !this.waitingTab.open;
    this.scoreTab.open = false;
    this.friendsTab.open = false;
  };

  openFriends = () => {
    this.friendsTab.open = !this.friendsTab.open;
    this.scoreTab.open = false;
    this.waitingTab.open = false;
  };

  openScore = () => {
    this.scoreTab.open = !this.scoreTab.open;
    this.friendsTab.open = false;
    this.waitingTab.open = false;
  };

  // ************************************
  //  Friend bar

  selectFriend = (friendId: string) => {
    this.router.navigate(["/user/" + friendId]);
  };

  // ************************************
  //  Init

  ngOnInit() {
    this.waitingTab.open = true;

    // this.usersService.configuration.apiKeys = {};
    // this.usersService.configuration.apiKeys[
    //   "Authorization"
    // ] = localStorage.getItem("currentUser");

    this.friends = this.usersService.usersContactsGet();
    this.waiting = this.usersService.usersWaitingGet();
    this.top = this.usersService.usersTopGet();
  }
}
