import { Component, OnInit, Input } from "@angular/core";

import { User } from "../../models/user";

@Component({
  selector: "app-sidebar-friend-element",
  templateUrl: "./sidebar-friend-element.component.html",
  styleUrls: ["./sidebar-friend-element.component.css"]
})
export class SidebarFriendElementComponent implements OnInit {
  @Input() user: User;

  ngOnInit() {}
}
