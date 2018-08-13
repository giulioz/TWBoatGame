import { Component, OnInit, Input } from "@angular/core";
import { User } from "../../models/user";

@Component({
  selector: "app-account-header",
  templateUrl: "./account-header.component.html",
  styleUrls: ["./account-header.component.css"]
})
export class AccountHeaderComponent implements OnInit {
  @Input() user: User;

  ngOnInit() {}
}
