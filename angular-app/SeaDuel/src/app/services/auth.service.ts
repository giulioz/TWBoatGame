import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  get loggedIn() {
    // return localStorage.getItem("currentUser") || 0;
    return true;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/users/login`, {
        username: username,
        password: password
      })
      .pipe(
        map(user => {
          if (user && user.token) {
            localStorage.setItem("currentUser", JSON.stringify(user));
          }

          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem("currentUser");
  }
}
