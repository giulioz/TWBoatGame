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
  startGameActive: boolean;

  @Output()
  startGame: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  onStartGame = () => {
    if (this.startGameActive) {
      this.startGame.emit();
    }
  };
}
