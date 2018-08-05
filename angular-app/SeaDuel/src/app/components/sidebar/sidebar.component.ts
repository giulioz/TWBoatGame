import { Component, OnInit, ViewChild, Input } from "@angular/core";

import { User } from "../../models/user";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  @ViewChild("gamesTab") gamesTab;
  @ViewChild("friendsTab") friendsTab;
  @ViewChild("scoreTab") scoreTab;

  @Input() friends: User[];

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

  ngOnInit() {}
}
