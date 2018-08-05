import { Component, OnInit } from "@angular/core";

import { User, UserState, UserType } from "../../models/user";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.css"]
})
export class RegisterFormComponent implements OnInit {
  model = new User("", "", "");

  onSubmit() {
    console.log(this.model);
  }

  ngOnInit() {}
}
