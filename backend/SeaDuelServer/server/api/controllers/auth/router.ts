import * as express from "express";
import AuthController from "./controller";
import AuthService from "../../services/auth.service";

export default (authService: AuthService) => {
  const controller = new AuthController(authService);
  return express
    .Router()
    .post("/checkToken", controller.checkToken)
    .post("/login", controller.login);
};
