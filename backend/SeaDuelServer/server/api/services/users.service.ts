import { DateTime, Duration } from "luxon";
import { hashPassword } from "./auth.service";
import { User, UserModel, GameStateType } from "./db.service";
import { MessagesService } from "./messages.service";
import { GamesService } from "./games.service";

export enum Errors {
  UserNotFound,
  UserExists
}

const lastActivityOnlineThreshold = Duration.fromObject({
  minutes: parseInt(process.env.OFFLINE_MINUTES)
}).as("milliseconds");

const kd = (u: User) => (u.wonGames + 1) / (u.wonGames + 1 + (u.lostGames + 1));

const state = (u: User): "offline" | "online" => {
  const lastActivityTime =
    DateTime.local().toMillis() - DateTime.fromISO(u.lastActivity).toMillis();
  const isOnline = lastActivityTime < lastActivityOnlineThreshold;
  return isOnline ? "online" : "offline";
};

const hasMessages = async (
  usr: string,
  b: string,
  messagesService: MessagesService
) => {
  const messages = await messagesService.conversation(usr, b);
  return (
    messages &&
    messages.filter(msg => msg.senderId === usr && !msg.readt).length > 0
  );
};

const hasGames = async (usr: string, b: string, gamesService: GamesService) => {
  const game = await gamesService.fromPlayers(usr, b);
  return game && game.state !== GameStateType.Ended;
};

function calculateUsersStats(
  users: User[],
  asUser?: string,
  messagesService?: MessagesService,
  gamesService?: GamesService
) {
  // FIXME
  return Promise.all(
    users.sort((a, b) => kd(b) - kd(a)).map(async (u, i) => {
      const hasUnreadMessages = asUser
        ? await hasMessages(u.id, asUser, messagesService)
        : false;
      const hasUnreadGames = asUser
        ? await hasGames(u.id, asUser, gamesService)
        : false;
      return {
        ...(u as any)._doc,
        position: i + 1,
        state: state(u),
        hasUnreadMessages,
        hasUnreadGames
      };
    })
  );
}

export class UsersService {
  private messagesService: MessagesService;
  private gamesService: GamesService;

  linkServices(messagesService: MessagesService, gamesService: GamesService) {
    this.messagesService = messagesService;
    this.gamesService = gamesService;
  }

  async all(asUser?: string): Promise<User[]> {
    const query = UserModel.find();
    const users = await query.exec();
    return calculateUsersStats(
      users,
      asUser,
      this.messagesService,
      this.gamesService
    );
  }

  async findId(id: string, asUser: string): Promise<User[]> {
    const users = await this.all(asUser);
    return users.filter(u => u.id.startsWith(id));
  }

  async byId(id: string, asUser?: string): Promise<User> {
    const users = await this.all(asUser);
    const user = users.filter(u => u.id === id)[0];
    if (user) return user;
    else throw Errors.UserNotFound;
  }

  async fetchIds(ids: string[], asUser: string): Promise<User[]> {
    const all = await this.all(asUser);
    return all.filter(u => ids.indexOf(u.id) !== -1);
  }

  async create(id: string, email: string, password: string): Promise<User> {
    const query = UserModel.countDocuments({ $or: [{ id }, { email }] });
    const exists = (await query.exec()) > 0;
    if (exists) {
      throw Errors.UserExists;
    }

    const userToSave = new UserModel({
      id,
      email,
      password: hashPassword(password),
      role: "user",
      registrationDate: DateTime.local().toISO(),
      state: "offline",
      wonGames: 0,
      lostGames: 0,
      position: NaN,
      lastActivity: DateTime.local().toISO(),
      playing: false
    });

    return userToSave.save();
  }

  async update(id: string, user: User): Promise<void> {
    if (user.password !== "") {
      user.password = hashPassword(user.password);
    } else {
      delete user.password;
    }
    const updateQuery = UserModel.updateOne({ id }, user);
    return updateQuery.exec();
  }

  async delete(id: string): Promise<void> {
    return UserModel.deleteOne({ id }).exec();
  }

  async contacts(id: string, asUser: string): Promise<User[]> {
    const messages = await this.messagesService.fromUser(id);
    const messagesUsers = [
      ...new Set(
        messages.map(m => (m.senderId === id ? m.recipientId : m.senderId))
      )
    ];
    const games = await this.gamesService.fromPlayer(id);
    const gamesUsers = [
      ...new Set(
        games.map(m => (m.playerId === id ? m.opponentId : m.playerId))
      )
    ];
    const userIds = [...new Set([...gamesUsers, ...messagesUsers])];
    return this.fetchIds(userIds, asUser);
  }

  async waiting(asUser: string): Promise<User[]> {
    const users = await this.all(asUser);
    return users.filter(u => !u.playing && u.state === "online").sort(
      (a, b) =>
        // FIXME
        DateTime.fromISO(a.lastActivity).toMillis() -
        DateTime.fromISO(b.lastActivity).toMillis()
    );
  }

  async touchLastActivity(id: string): Promise<void> {
    const updateQuery = UserModel.updateOne(
      { id },
      { lastActivity: DateTime.local().toISO() }
    );
    return updateQuery.exec();
  }

  async incrementStats(
    id: string,
    deltaWin: number,
    deltaLoose: number
  ): Promise<void> {
    return UserModel.updateOne(
      { id },
      { $inc: { wonGames: deltaWin, lostGames: deltaLoose } }
    ).exec();
  }
}

export default UsersService;
