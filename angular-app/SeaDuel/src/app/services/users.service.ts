import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";
import { User } from "../models/user";

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  getUserInfo(userId: string): Observable<User> {
      return this.http.get<User>(`${environment.apiUrl}/users/info/${userId}`);
  }
}
