import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../swagger";

@Injectable()
export class AuthService {
  constructor(private authService: AuthenticationService) {}

  async isLoggedIn() {
    return new Promise(resolve => {
      this.authService
        .authCheckTokenPost({
          token: localStorage.getItem("currentUser") || ""
        })
        .subscribe(() => resolve(true), () => resolve(false));
    });
  }

  async login(id: string, password: string) {
    return new Promise(resolve => {
      this.authService.authLoginPost({ id, password }).subscribe(user => {
        if (user) {
          localStorage.setItem("currentUser", user);
        }

        resolve(user);
      }, error => resolve(null));
    });
  }

  logout() {
    localStorage.removeItem("currentUser");
  }
}
