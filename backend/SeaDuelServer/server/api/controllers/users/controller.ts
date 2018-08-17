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
    let user;
    try {
      user = await this.usersService.byId(req.params.id);
      console.log(user);
    } catch {
      res.status(404).end();
      return;
    }

    if (
      (await isSameUser(this.authService, req, req.params.id)) ||
      (await adminAuthCheck(this.authService, req))
    ) {
      user.password = "";
      res.json(user);
    } else if (await userAuthCheck(this.authService, req)) {
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
        res.status(500).end();
      }
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    await this.usersService.update(req.body.name);
    res.status(200).end();
  };
}
export default Controller;
