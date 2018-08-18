import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { AuthRequest, UsersService } from "../../../swagger";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.css"]
})
export class RegisterFormComponent implements OnInit {
  @ViewChild("message")
  message;

  model: AuthRequest = { id: "", email: "", password: "" };

  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  async onSubmit() {
    this.usersService.usersPost(this.model).subscribe(
      async next => {
        const login = await this.authService.login(
          this.model.id,
          this.model.password
        );
        if (login) {
          this.router.navigate(["/ingame"]);
        }
      },
      error => {
        this.message.nativeElement.textContent =
          "Username o mail già presente. Riprova.";
      }
    );
  }

  ngOnInit() {}
}
