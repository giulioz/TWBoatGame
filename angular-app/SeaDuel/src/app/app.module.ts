import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { IngameComponent } from "./ingame/ingame.component";
import { RegisterFormComponent } from "./register-form/register-form.component";
import { LoginComponent } from './login/login.component';

import { AuthService } from "./services/auth.service";
import { RegistrationService } from "./services/registration.service";
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IngameComponent,
    RegisterFormComponent,
    LoginComponent,
    FooterComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ScrollToModule.forRoot(), FormsModule],
  providers: [AuthService, RegistrationService],
  bootstrap: [AppComponent]
})
export class AppModule {}
