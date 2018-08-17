import "./common/env";
import Server from "./common/server";
import Routes from "./routes";
import * as http from "http";

import UsersService from "./api/services/users.service";
import MessagesService from "./api/services/messages.service";
import GamesService from "./api/services/games.service";
import AuthService from "./api/services/auth.service";
import DbService from "./api/services/db.service";
import EventsService from "./api/services/events.service";

const dbService = new DbService();
const eventsService = new EventsService();
const gamesService = new GamesService();
const usersService = new UsersService(gamesService);
const authService = new AuthService(usersService);
const messagesService = new MessagesService();

const port = parseInt(process.env.PORT);
const app = new Server();
const server = http.createServer(app.app);
dbService.connectDb(process.env.DB_URL);
eventsService.initServer(server, authService);
app
  .router(
    Routes(
      usersService,
      messagesService,
      gamesService,
      authService,
      eventsService
    )
  )
  .listen(server, port);
