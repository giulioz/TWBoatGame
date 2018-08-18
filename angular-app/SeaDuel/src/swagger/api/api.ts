export * from "./authentication.service";
import { AuthenticationService } from "./authentication.service";
export * from "./games.service";
import { GamesService } from "./games.service";
export * from "./messaging.service";
import { MessagingService } from "./messaging.service";
export * from "./users.service";
import { UsersService } from "./users.service";
export const APIS = [
  AuthenticationService,
  GamesService,
  MessagingService,
  UsersService
];
