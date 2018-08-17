import { Application } from "express";
import UsersRouter from "./api/controllers/users/router";
import AuthRouter from "./api/controllers/auth/router";
import UsersService from "./api/services/users.service";
import MessagesService from "./api/services/messages.service";
import GamesService from "./api/services/games.service";
import AuthService from "./api/services/auth.service";

export default (
  usersService: UsersService,
  messagesService: MessagesService,
  gamesService: GamesService,
  authService: AuthService
) =>
  function routes(app: Application): void {
    const usersRouter = UsersRouter(usersService, messagesService, gamesService, authService);
    const authRouter = AuthRouter(authService);

    app.use("/api/v1/users", usersRouter);
    app.use("/api/v1/auth", authRouter);
  };
