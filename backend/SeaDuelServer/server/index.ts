import './common/env';
import Server from './common/server';
import Routes from './routes';

import UsersService from './api/services/users.service';
import MessagesService from './api/services/messages.service';
import GamesService from './api/services/games.service';
import AuthService from './api/services/auth.service';
import DbService, { UserModel } from './api/services/db.service';
import { DateTime } from 'luxon';

const dbService = new DbService();
dbService.connectDb("mongodb://localhost/seaduel");
const gamesService = new GamesService();
const usersService = new UsersService(gamesService);
const authService = new AuthService(usersService);
const messagesService = new MessagesService();

const userTest = new UserModel({
  id: "giulioz",
  email: "none",
  password: "873d570a0c7f121bd0dd9b2f274156bf694ebc07561d17b94b8cd726db3b37c2",
  role: "user",
  registrationDate: DateTime.local(),
  wonGames: 0,
  lostGames: 0,
  lastActivity: DateTime.local(),
  position: NaN,
  state: "offline"
});
userTest.save().then(() => console.log("meow"));


const port = parseInt(process.env.PORT);
export default new Server()
  .router(Routes(usersService, messagesService, gamesService, authService))
  .listen(port);
