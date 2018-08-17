import UsersService, {
  Errors as UsersServiceErrors
} from "../../services/users.service";
import MessagesService from "../../services/messages.service";
import GamesService from "../../services/games.service";
import AuthService, {
  isSameUser,
  adminAuthCheck,
  userAuthCheck
} from "../../services/auth.service";

import { Request, Response } from "express";

export class Controller {
  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
    private gamesService: GamesService,
    private authService: AuthService
  ) {}

  byId = async (req: Request, res: Response): Promise<void> => {
    if (
      await isSameUser(this.authService, req, req.params.id) ||
      await adminAuthCheck(this.authService, req)
    ) {
      try {
        const user = await this.usersService.byId(req.params.id);
        user.password = "";

        res.json(user);
      } catch {
        res.status(404).end();
      }
    } else if (await userAuthCheck(this.authService, req)) {
      try {
        const user = await this.usersService.byId(req.params.id);
        user.password = "";
        user.email = "";

        res.json(user);
      } catch {
        res.status(404).end();
      }
    } else {
      res.status(403).end();
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
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
      }
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    this.usersService.update(req.body.name).then(r =>
      res
        .status(201)
        .location(`/api/v1/users/${r.id}`)
        .json(r)
    );
  };
}
export default Controller;
