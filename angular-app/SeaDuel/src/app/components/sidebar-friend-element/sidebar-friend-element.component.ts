import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { User } from "../../../swagger";

@Component({
  selector: "app-sidebar-friend-element",
  templateUrl: "./sidebar-friend-element.component.html",
  styleUrls: ["./sidebar-friend-element.component.css"]
})
export class SidebarFriendElementComponent implements OnInit {
  @Input()
  user: User;
  @Input()
  selected: boolean;
  @Input()
  showPosition: boolean;
  @Output()
  select: EventEmitter<any> = new EventEmitter();

  onSelect(): void {
    this.select.emit();
  }

  ngOnInit() {}
}
