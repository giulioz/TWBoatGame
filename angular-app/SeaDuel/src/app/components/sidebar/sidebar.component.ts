import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router } from "@angular/router";

import { UserStore } from "../../state/user-store";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  @ViewChild("gamesTab") gamesTab;
  @ViewChild("friendsTab") friendsTab;
  @ViewChild("scoreTab") scoreTab;

  @Input() selectedUser: string;

  constructor(private router: Router, private userStore: UserStore) {}

  // ************************************
  //  Collapse

  openGames = () => {
    this.gamesTab.open = !this.gamesTab.open;
    this.scoreTab.open = false;
    this.friendsTab.open = false;
  };

  openFriends = () => {
    this.friendsTab.open = !this.friendsTab.open;
    this.scoreTab.open = false;
    this.gamesTab.open = false;
  };

  openScore = () => {
    this.scoreTab.open = !this.scoreTab.open;
    this.friendsTab.open = false;
    this.gamesTab.open = false;
  };

  // ************************************
  //  Friend bar

  selectFriend = (friendId: string) => {
    this.router.navigate(["/user/" + friendId]);
  };

  // ************************************
  //  Init

  ngOnInit() {
    this.gamesTab.open = true;
  }
}
