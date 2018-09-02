import * as express from "express";
import { Application } from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as os from "os";
import swaggerify from "./swagger";
import l from "./logger";

export default class ExpressServer {
  public app;

  constructor() {
    const root = path.normalize(__dirname + "/../..");
    this.app = express();
    this.app.use("*", function(req, res, next) {
      // HACK
      res.setHeader("WWW-Authenticate", "NO DIOCAN");
      next();
    });
    this.app.set("appPath", root + "client");
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/doc", express.static(`${root}/public`));
    this.app.use("/", express.static(`${root}/angular_build`));

    const handler = async (req, res: express.Response) =>
      res.sendFile(`${root}/angular_build/index.html`, { root: root });
    const routes = ["/login", "/ingame", "/user/*", "/my", "/admin"];
    routes.forEach(route => this.app.get(route, handler));
  }

  router = (routes: (app: Application) => void): ExpressServer => {
    swaggerify(this.app, routes);
    return this;
  };

  listen = (
    httpServer: http.Server,
    port: number = parseInt(process.env.PORT)
  ): Application => {
    const welcome = port => () =>
      l.info(
        `up and running in ${process.env.NODE_ENV ||
          "development"} @: ${os.hostname()} on port: ${port}}`
      );
    httpServer.listen(port, welcome(port));
    return this.app;
  };
}
