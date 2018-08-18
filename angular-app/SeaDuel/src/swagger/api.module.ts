import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Configuration } from "./configuration";

import { AuthenticationService } from "./api/authentication.service";
import { GamesService } from "./api/games.service";
import { MessagingService } from "./api/messaging.service";
import { UsersService } from "./api/users.service";

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [],
  exports: [],
  providers: [
    AuthenticationService,
    GamesService,
    MessagingService,
    UsersService
  ]
})
export class ApiModule {
  public static forRoot(
    configurationFactory: () => Configuration
  ): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ApiModule
  ) {
    if (parentModule) {
      throw new Error(
        "ApiModule is already loaded. Import your base AppModule only."
      );
    }
  }
}
