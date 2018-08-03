import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  @ViewChild("friends") friends;

  openFriends = () =>  {
    this.friends.open = !this.friends.open;
    // disable others
  }

  ngOnInit() {}
}
