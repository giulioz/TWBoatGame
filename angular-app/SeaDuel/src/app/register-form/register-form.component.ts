import { Component, OnInit } from "@angular/core";

import { User } from "../models/user";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.css"]
})
export class RegisterFormComponent implements OnInit {
  model = new User("", "", "", "user");

  onSubmit() {
    console.log(this.model);
  }

  ngOnInit() {}
}
