import * as express from "express";
import UsersController from "./controller";
import { UsersService } from "../../services/users.service";
import { MessagesService } from "../../services/messages.service";
import GamesService from "../../services/games.service";
import { AuthService } from "../../services/auth.service";

export default (
  usersService: UsersService,
  messagesService: MessagesService,
  gamesService: GamesService,
  authService: AuthService
) => {
  const controller = new UsersController(
    usersService,
    messagesService,
    gamesService,
    authService
  );
  return express
    .Router()
    .post("/", controller.create)
    .get("/byId/:id", controller.byId)
    .put("/byId/:id", controller.update);
};
