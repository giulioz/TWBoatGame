import UsersService, {
  Errors as UsersServiceErrors
} from "../../services/users.service";
import MessagesService from "../../services/messages.service";
import GamesService from "../../services/games.service";
import AuthService, { authCheck } from "../../services/auth.service";
import EventsService, { EventType } from "../../services/events.service";

import { Request, Response } from "express";
import l from "../../../common/logger";

export class Controller {
  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
    private gamesService: GamesService,
    private authService: AuthService,
    private eventsService: EventsService
  ) {}

  byId = async (req: Request, res: Response): Promise<void> => {
    let user;
    try {
      user = await this.usersService.byId(req.params.id);
    } catch {
      res.status(404).end();
      return;
    }

    const auth = await authCheck(this.authService, req);
    if (auth.id === req.params.id || auth.role === "administrator") {
      user.password = "";
      res.json(user);
    } else if (auth) {
      user.password = "";
      user.email = "";

      res.json(user);
    } else {
      res.status(403).end();
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    // TODO: limit user creation per client
    const { id, email, password } = req.body;
    try {
      const created = await this.usersService.create(id, email, password);
      res
        .status(201)
        .location(`/api/v1/users/${created.id}`)
        .json(created);
    } catch (err) {
      if (err === UsersServiceErrors.UserExists) {
        res.status(409).end();
      } else {
        l.error(err);
        res.status(500).end();
      }
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);
    if (user.role === "administrator") {
      await this.usersService.update(req.params.id, req.body);
      res.status(200).end();
    } else if (user.id === req.params.id) {
      delete req.body.id;
      delete req.body.role;
      delete req.body.registrationDate;
      delete req.body.state;
      delete req.body.wonGames;
      delete req.body.lostGames;
      delete req.body.position;
      delete req.body.lastActivity;
      await this.usersService.update(req.params.id, req.body);
      res.status(200).end();
    } else {
      res.status(403).end();
    }
  };

  getMessages = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);
    if (user) {
      const conversation = await this.messagesService.conversation(
        user.id,
        req.params.id
      );
      res.json(conversation);
    } else {
      res.status(403).end();
    }
  };

  postMessage = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);
    if (user) {
      await this.messagesService.send(user.id, req.params.id, req.body.content);
      this.eventsService.sendEvent({type: EventType.IncomingMessage, userId: user.id}, req.params.id);
      res.send(200).end();
    } else {
      res.status(403).end();
    }
  };
}
export default Controller;
