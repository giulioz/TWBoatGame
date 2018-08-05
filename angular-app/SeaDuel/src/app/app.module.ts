// Angular
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

// Externals
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

// Modules
import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { IngameComponent } from "./components/ingame/ingame.component";
import { RegisterFormComponent } from "./components/register-form/register-form.component";
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarTabComponent } from './components/sidebar-tab/sidebar-tab.component';
import { SidebarFriendElementComponent } from './components/sidebar-friend-element/sidebar-friend-element.component';
import { SidebarFriendSearchComponent } from './components/sidebar-friend-search/sidebar-friend-search.component';

// Services
import { AuthService } from "./services/auth.service";
import { RegistrationService } from "./services/registration.service";

// Pipes
import { UserstatusColorPipe } from './pipes/userstatus-color.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IngameComponent,
    RegisterFormComponent,
    LoginComponent,
    FooterComponent,
    SidebarComponent,
    SidebarTabComponent,
    SidebarFriendElementComponent,
    UserstatusColorPipe,
    SidebarFriendSearchComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ScrollToModule.forRoot(), FormsModule],
  providers: [AuthService, RegistrationService],
  bootstrap: [AppComponent]
})
export class AppModule {}
