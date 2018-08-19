import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { timer, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { User, UsersService } from "../../../swagger";
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

  friends: Observable<User[]>;
  waiting: Observable<User[]>;
  top: Observable<User[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
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
    this.userId = this.authService.getUserToken().id;

    this.friends = timer(0, 3000).pipe(
      switchMap(() => this.usersService.usersContactsGet())
    );

    this.waiting = timer(0, 3000).pipe(
      switchMap(() => this.usersService.usersWaitingGet())
    );

    this.top = timer(0, 3000).pipe(
      switchMap(() => this.usersService.usersTopGet())
    );
  }
}
