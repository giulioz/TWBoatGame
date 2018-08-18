import { Injectable } from "@angular/core";
import { AuthenticationService, Configuration } from "../../swagger";

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
}
