import { Component, OnInit } from '@angular/core';

import { User, UserState, UserType } from "../../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = new User("", "", "");

  onSubmit() {
    console.log(this.model);
  }

  constructor() { }

  ngOnInit() {
  }

}
