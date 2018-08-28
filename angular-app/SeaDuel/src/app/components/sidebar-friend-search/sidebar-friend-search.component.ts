import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-sidebar-friend-search",
  templateUrl: "./sidebar-friend-search.component.html",
  styleUrls: ["./sidebar-friend-search.component.css"]
})
export class SidebarFriendSearchComponent implements OnInit {
  @Output()
  find: EventEmitter<string> = new EventEmitter();

  ngOnInit() {}

  onChange(value: string) {
    this.find.emit(value);
  }
}
