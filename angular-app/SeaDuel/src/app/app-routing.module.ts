import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { IngameComponent } from "./components/ingame/ingame.component";
import { LoginComponent } from "./components/login/login.component";
import { AdminPageComponent } from "./components/admin-page/admin-page.component";
import { AccountPageComponent } from "./components/account-page/account-page.component";
import { AuthGuard } from "./services/auth-guard.service";
import { NoAuthGuard } from "./services/noauth-guard.service";
import { AdminGuard } from "./services/admin-guard.service";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: "ingame",
    component: IngameComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "user/:id",
    component: IngameComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "my",
    component: AccountPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin",
    component: AdminPageComponent,
    canActivate: [AdminGuard]
  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
