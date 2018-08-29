// Angular
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// Externals
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

// Modules
import { AppRoutingModule } from "./app-routing.module";
import {
  ApiModule,
  BASE_PATH,
  Configuration,
  ConfigurationParameters
} from "../swagger";

// Components
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { IngameComponent } from "./components/ingame/ingame.component";
import { RegisterFormComponent } from "./components/register-form/register-form.component";
import { LoginComponent } from "./components/login/login.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SidebarTabComponent } from "./components/sidebar-tab/sidebar-tab.component";
import { SidebarFriendElementComponent } from "./components/sidebar-friend-element/sidebar-friend-element.component";
import { SidebarFriendSearchComponent } from "./components/sidebar-friend-search/sidebar-friend-search.component";
import { AccountHeaderComponent } from "./components/account-header/account-header.component";
import { ChatComponent } from "./components/chat/chat.component";
import { GameAreaComponent } from "./components/game-area/game-area.component";
import { AdminPageComponent } from "./components/admin-page/admin-page.component";
import { AccountPageComponent } from "./components/account-page/account-page.component";
import { WaveBackgroundComponent } from "./components/wave-background/wave-background.component";
import { BoardViewComponent } from "./components/board-view/board-view.component";
import { BoatsViewComponent } from './components/boats-view/boats-view.component';

// Services
import { AuthService } from "./services/auth.service";
import { EventsService } from "./services/events.service";
import { AuthGuard } from "./services/auth-guard.service";
import { NoAuthGuard } from "./services/noauth-guard.service";
import { AdminGuard } from "./services/admin-guard.service";

// Pipes
import { UserstatusColorPipe } from "./pipes/userstatus-color.pipe";

import { environment } from "../environments/environment";

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    apiKeys: { Authorization: localStorage.getItem("currentUser") }
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BoatsViewComponent,
    IngameComponent,
    RegisterFormComponent,
    LoginComponent,
    FooterComponent,
    SidebarComponent,
    SidebarTabComponent,
    SidebarFriendElementComponent,
    UserstatusColorPipe,
    SidebarFriendSearchComponent,
    AccountHeaderComponent,
    ChatComponent,
    GameAreaComponent,
    AdminPageComponent,
    AccountPageComponent,
    WaveBackgroundComponent,
    BoardViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ScrollToModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory)
  ],
  providers: [
    EventsService,
    AuthService,
    AuthGuard,
    NoAuthGuard,
    AdminGuard,
    { provide: BASE_PATH, useValue: environment.apiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
