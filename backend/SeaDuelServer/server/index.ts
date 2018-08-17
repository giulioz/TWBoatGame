import './common/env';
import Server from './common/server';
import Routes from './routes';

import UsersService from './api/services/users.service';
import MessagesService from './api/services/messages.service';
import GamesService from './api/services/games.service';
import AuthService from './api/services/auth.service';

const gamesService = new GamesService();
const usersService = new UsersService(gamesService);
const authService = new AuthService(usersService);
const messagesService = new MessagesService();

const port = parseInt(process.env.PORT);
export default new Server()
  .router(Routes(usersService, messagesService, gamesService, authService))
  .listen(port);
