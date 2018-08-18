import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router } from "@angular/router";

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

  @Input()
  selectedUser: string;

  constructor(private router: Router) {}

  // ************************************
  //  Collapse

  openGames = () => {
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
  }
}
