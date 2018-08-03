import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-sidebar-tab",
  templateUrl: "./sidebar-tab.component.html",
  styleUrls: ["./sidebar-tab.component.css"]
})
export class SidebarTabComponent implements OnInit {
  @Input() text: string;

  @Input() icon: string;

  open = false;

  @Output() select: EventEmitter<any> = new EventEmitter();

  onSelect(): void {
    this.select.emit();
  }

  ngOnInit() {
    console.log(this);
  }
}
