import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { User } from "../../../swagger";

@Component({
  selector: "app-account-header",
  templateUrl: "./account-header.component.html",
  styleUrls: ["./account-header.component.css"]
})
export class AccountHeaderComponent implements OnInit {
  @Input()
  user: User;

  @Input()
  actionActive: boolean;
  @Input()
  actionText: string;
  @Output()
  action: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  onAction = () => {
    if (this.actionActive) {
      this.action.emit();
    }
  };
}
