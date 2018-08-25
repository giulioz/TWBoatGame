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
    .get("/", controller.all)
    .get("/findId/:id", controller.findId)
    .get("/byId/:id", controller.byId)
    .delete("/byId/:id", controller.delete)
    .put("/byId/:id", controller.update)
    .get("/contacts", controller.contacts)
    .get("/waiting", controller.waiting)
    .get("/top", controller.top)
    .get("/byId/:id/messages", controller.getMessages)
    .post("/byId/:id/messages", controller.postMessage)
    .get("/byId/:id/game", controller.getGame)
    .post("/byId/:id/game", controller.newGame)
    .put("/byId/:id/game", controller.acceptGame)
    .delete("/byId/:id/game", controller.resignGame)
    .post("/byId/:id/game/boats", controller.addBoat)
    .post("/byId/:id/game/moves", controller.doMove);
};
