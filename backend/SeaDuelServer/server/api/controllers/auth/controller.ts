import AuthService from "../../services/auth.service";

import { Request, Response } from "express";

export class Controller {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { id, password } = req.body;
    try {
      const found = await this.authService.auth(id, password);
      res.status(200).json(found);
    } catch (err) {
      res.status(403).end();
    }
  };

  checkToken = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.authService.checkToken(req.body.token);
      res.status(200).end();
    } catch (err) {
      res.status(403).end();
    }
  };
}
export default Controller;
