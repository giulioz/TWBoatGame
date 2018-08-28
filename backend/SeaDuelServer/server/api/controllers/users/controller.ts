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

  all = async (req: Request, res: Response): Promise<void> => {
    const auth = await authCheck(this.authService, req);

    if (auth && auth.role === "administrator") {
      const users = await this.usersService.all();
      res.json(users.map(u => ({ ...u, password: "" })));
    } else {
      res.status(403).end();
    }
  };

  findId = async (req: Request, res: Response): Promise<void> => {
    const auth = await authCheck(this.authService, req);
    const users = await this.usersService.findId(req.params.id);

    if (auth && (auth.id === req.params.id || auth.role === "administrator")) {
      res.json(users.map(u => ({ ...u, password: "" })));
    } else if (auth) {
      res.json(users.map(u => ({ ...u, password: "", email: "" })));
    } else {
      res.status(403).end();
    }
  };

  byId = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = await authCheck(this.authService, req);
      const user = await this.usersService.byId(req.params.id);

      if (
        auth &&
        (auth.id === req.params.id || auth.role === "administrator")
      ) {
        user.password = "";

        res.json(user);
      } else if (auth) {
        user.password = "";
        user.email = "";

        res.json(user);
      } else {
        res.status(403).end();
      }
    } catch {
      res.status(404).end();
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

  delete = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user && (user.role === "administrator" || user.id === req.params.id)) {
      await this.usersService.delete(req.params.id);
      res.status(200).end();
    } else {
      res.status(403).end();
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user && user.role === "administrator") {
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

  contacts = async (req: Request, res: Response): Promise<void> => {
    const auth = await authCheck(this.authService, req);

    if (auth) {
      const users = await this.usersService.contacts(auth.id);
      const usersStriped = users.map(u => ({ ...u, password: "", email: "" }));

      res.json(usersStriped);
    } else {
      res.status(403).end();
    }
  };

  waiting = async (req: Request, res: Response): Promise<void> => {
    const auth = await authCheck(this.authService, req);

    if (auth) {
      const users = await this.usersService.waiting();
      const usersStriped = users
        .map(u => ({ ...u, password: "", email: "" }))
        .filter(u => u.id != auth.id);

      res.json(usersStriped);
    } else {
      res.status(403).end();
    }
  };

  top = async (req: Request, res: Response): Promise<void> => {
    const auth = await authCheck(this.authService, req);

    if (auth) {
      const users = await this.usersService.all();
      const usersStriped = users
        .slice(0, 10)
        .map(u => ({ ...u, password: "", email: "" }));

      res.json(usersStriped);
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
      await this.messagesService.conversationSetRead(user.id, req.params.id);

      res.json(conversation);
    } else {
      res.status(403).end();
    }
  };

  postMessage = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user && req.body.content) {
      const msg = await this.messagesService.send(
        user.id,
        req.params.id,
        req.body.content
      );
      this.eventsService.sendEvent(
        { type: EventType.IncomingMessage, userId: user.id },
        user.id
      );
      this.eventsService.sendEvent(
        { type: EventType.IncomingMessage, userId: user.id },
        req.params.id
      );

      res.json(msg);
    } else {
      res.status(403).end();
    }
  };

  getGame = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user) {
      const game = await this.gamesService.fromPlayersAsPlayer(
        user.id,
        req.params.id
      );

      res.json(game);
    } else {
      res.status(403).end();
    }
  };

  newGame = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user) {
      try {
        const game = await this.gamesService.sendRequest(
          user.id,
          req.params.id
        );

        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          user.id
        );
        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          req.params.id
        );
        res.json(game);
      } catch (e) {
        // Game not ended
        res.status(409).end();
      }
    } else {
      res.status(403).end();
    }
  };

  acceptGame = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user) {
      try {
        await this.gamesService.acceptGame(user.id, req.params.id);

        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          user.id
        );
        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          req.params.id
        );
        res.status(200).end();
      } catch {
        res.status(404).end();
      }
    } else {
      res.status(403).end();
    }
  };

  resignGame = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user) {
      await this.gamesService.resign(user.id, req.params.id);

      this.eventsService.sendEvent(
        { type: EventType.GameChanged, userId: user.id },
        user.id
      );
      this.eventsService.sendEvent(
        { type: EventType.GameChanged, userId: user.id },
        req.params.id
      );
      res.send(200).end();
    } else {
      res.status(403).end();
    }
  };

  addBoat = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user) {
      try {
        await this.gamesService.addBoat(
          user.id,
          req.params.id,
          req.body.type,
          req.body.x,
          req.body.y,
          req.body.direction
        );

        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          user.id
        );
        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          req.params.id
        );
        res.send(200).end();
      } catch {
        res.status(400).end();
      }

      res.status(200).end();
    } else {
      res.status(403).end();
    }
  };

  doMove = async (req: Request, res: Response): Promise<void> => {
    const user = await authCheck(this.authService, req);

    if (user) {
      try {
        this.gamesService.doMove(
          user.id,
          req.params.id,
          req.body.x,
          req.body.y
        );

        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          user.id
        );
        this.eventsService.sendEvent(
          { type: EventType.GameChanged, userId: user.id },
          req.params.id
        );
        res.send(200).end();
      } catch {
        res.status(404).end();
      }

      res.status(200).end();
    } else {
      res.status(403).end();
    }
  };
}

export default Controller;
