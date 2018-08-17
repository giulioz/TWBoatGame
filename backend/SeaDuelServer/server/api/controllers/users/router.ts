import * as express from "express";
import UsersController from "./controller";
import UsersService from "../../services/users.service";
import MessagesService from "../../services/messages.service";
import GamesService from "../../services/games.service";
import AuthService from "../../services/auth.service";
import EventsService from "../../services/events.service";

export default (
  usersService: UsersService,
  messagesService: MessagesService,
  gamesService: GamesService,
  authService: AuthService,
  eventsService: EventsService
) => {
  const controller = new UsersController(
    usersService,
    messagesService,
    gamesService,
    authService,
    eventsService
  );
  return express
    .Router()
    .post("/", controller.create)
    .get("/byId/:id", controller.byId)
    .put("/byId/:id", controller.update)
    .get("/byId/:id/messages", controller.getMessages)
    .post("/byId/:id/messages", controller.postMessage);
};
