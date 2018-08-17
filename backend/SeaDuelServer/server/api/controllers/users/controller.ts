import UsersService, {
  Errors as UsersServiceErrors
} from "../../services/users.service";
import MessagesService from "../../services/messages.service";
import GamesService from "../../services/games.service";
import AuthService from "../../services/auth.service";

import { Request, Response } from "express";

export class Controller {
  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
    private gamesService: GamesService,
    private authService: AuthService
  ) {}

  byId = async (req: Request, res: Response): Promise<void> => {
    const user = await this.usersService.byId(req.params.id);
    if (user) res.json(user);
    else res.status(404).end();
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
