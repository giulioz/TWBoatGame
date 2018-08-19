import { Injectable } from "@angular/core";
import { AuthenticationService, Configuration } from "../../swagger";
import { EventsService } from "./events.service";
import { DateTime } from "luxon";

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

@Injectable()
export class AuthService {
  constructor(
    private authService: AuthenticationService,
    private configuration: Configuration
  ) {}

  async isLoggedIn() {
    return new Promise(resolve => {
      this.authService
        .authCheckTokenPost({
          token: localStorage.getItem("currentUser") || ""
        })
        .subscribe(
          () => {
            this.configuration.apiKeys = {};
            this.configuration.apiKeys["Authorization"] = localStorage.getItem(
              "currentUser"
            );
            resolve(true);
          },
          () => resolve(false)
        );
    });
  }

  async login(id: string, password: string) {
    return new Promise(resolve => {
      this.authService.authLoginPost({ id, password }).subscribe(
        user => {
          if (user) {
            localStorage.setItem("currentUser", user);
            this.configuration.apiKeys = {};
            this.configuration.apiKeys["Authorization"] = user;
          }

          resolve(user);
        },
        error => resolve(null)
      );
    });
  }

  logout() {
    localStorage.removeItem("currentUser");
  }

  getToken() {
    return localStorage.getItem("currentUser");
  }

  getUserToken() {
    return parseJwt(localStorage.getItem("currentUser").split(" ")[1]) as {
      id: string;
      email: string;
      loginTime: DateTime;
      role: "user" | "administrator";
    };
  }
}
