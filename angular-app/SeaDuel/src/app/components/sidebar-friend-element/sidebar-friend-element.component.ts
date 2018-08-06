import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { User } from "../../models/user";

@Component({
  selector: "app-sidebar-friend-element",
  templateUrl: "./sidebar-friend-element.component.html",
  styleUrls: ["./sidebar-friend-element.component.css"]
})
export class SidebarFriendElementComponent implements OnInit {
  @Input() user: User;
  @Input() selected: boolean;
  @Output() select: EventEmitter<any> = new EventEmitter();

  get hasUnread() {
    return (
      this.user &&
      this.user.conversation[this.user.conversation.length - 1] &&
      !this.user.conversation[this.user.conversation.length - 1].readt
    );
  }

  onSelect(): void {
    this.select.emit();
  }

  ngOnInit() {}
}
