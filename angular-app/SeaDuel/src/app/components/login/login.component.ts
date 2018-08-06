import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @ViewChild("message") message;
  username: string;
  password: string;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      result => {
        if (result) {
          this.router.navigate(["/ingame"]);
        } else {
          this.message.nativeElement.textContent = "Username o password errate. Riprova.";
        }
      },
      error => {
        this.message.nativeElement.textContent = "Username o password errate. Riprova.";
      }
    );
  }

  ngOnInit() {}
}
