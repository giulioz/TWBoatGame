import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!(await this.authService.isLoggedIn())) {
      return true;
    }

    this.router.navigate(["/ingame"]);
    return false;
  }
}
