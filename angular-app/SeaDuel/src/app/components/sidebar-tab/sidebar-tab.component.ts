import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-sidebar-tab",
  templateUrl: "./sidebar-tab.component.html",
  styleUrls: ["./sidebar-tab.component.css"]
})
export class SidebarTabComponent implements OnInit {
  @Input()
  collapse: boolean;
  @Input()
  text: string;
  @Input()
  icon: string;

  open = true;

  onSelect(): void {
    this.open = !this.open;
  }

  ngOnInit() {}
}
