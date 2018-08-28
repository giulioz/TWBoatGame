import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../../swagger";
import { AuthService } from "../../services/auth.service";

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

  userId: string;

  @Input()
  friends: User[];
  @Input()
  waiting: User[];
  @Input()
  top: User[];

  @Output()
  find: EventEmitter<string> = new EventEmitter();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // ************************************
  //  Collapse

  openWaiting = () => {
    this.waitingTab.open = !this.waitingTab.open;
    // this.scoreTab.open = false;
    // this.friendsTab.open = false;
  };

  openFriends = () => {
    this.friendsTab.open = !this.friendsTab.open;
    // this.scoreTab.open = false;
    // this.waitingTab.open = false;
  };

  openScore = () => {
    this.scoreTab.open = !this.scoreTab.open;
    // this.friendsTab.open = false;
    // this.waitingTab.open = false;
  };

  // ************************************
  //  Friend bar

  selectFriend = (userId: string) => {
    if (userId !== this.userId) {
      this.router.navigate(["/user/" + userId]);
    }
  };

  onFind = (userId: string) => {
    this.find.emit(userId);
  }

  // ************************************
  //  Waiting bar

  selectWaiting = (userId: string) => {
    if (userId !== this.userId) {
      this.router.navigate(["/user/" + userId]);
    }
  };

  // ************************************
  //  Highscores bar

  selectHighscores = (userId: string) => {
    if (userId !== this.userId) {
      this.router.navigate(["/user/" + userId]);
    }
  };

  // ************************************
  //  Init

  ngOnInit() {
    this.waitingTab.open = true;
    this.friendsTab.open = true;
    this.scoreTab.open = true;
    this.userId = this.authService.getUserToken().id;
  }
}
