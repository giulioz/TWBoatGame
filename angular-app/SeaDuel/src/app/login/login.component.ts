import { Component, OnInit } from '@angular/core';

import { User } from "../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = new User("", "", "", "user");

  onSubmit() {
    console.log(this.model);
  }

  constructor() { }

  ngOnInit() {
  }

}
