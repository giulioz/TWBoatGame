import { DateTime, Duration } from "luxon";
import { hashPassword } from "./auth.service";
import { User, UserModel } from "./db.service";
import { MessagesService } from "./messages.service";
import { GamesService } from "./games.service";

export enum Errors {
  UserNotFound,
  UserExists
}

const lastActivityOnlineThreshold = Duration.fromObject({
  minutes: parseInt(process.env.OFFLINE_MINUTES)
}).as("milliseconds");

const kd = (u: User) => u.wonGames / (u.wonGames + u.lostGames);

const state = (u: User): "offline" | "online" | "playing" => {
  // FIXME
  const lastActivityTime =
    DateTime.local().toMillis() - DateTime.fromISO(u.lastActivity).toMillis();
  const isOnline = lastActivityTime < lastActivityOnlineThreshold;
  return isOnline ? "online" : "offline";
};

function calculateUsersStats(users: User[]) {
  return users
    .sort((a, b) => kd(a) - kd(b))
    .map((u, i) => ({ ...(u as any)._doc, position: i, state: state(u) }));
}

export class UsersService {
  private messagesService: MessagesService;
  private gamesService: GamesService;

  linkServices(messagesService: MessagesService, gamesService: GamesService) {
    this.messagesService = messagesService;
    this.gamesService = gamesService;
  }

  async all(): Promise<User[]> {
    const query = UserModel.find();
    const users = await query.exec();
    return calculateUsersStats(users);
  }

  async findId(id: string): Promise<User[]> {
    const users = await this.all();
    return users.filter(u => u.id.startsWith(id));
  }

  async byId(id: string): Promise<User> {
    const users = await this.all();
    const user = users.filter(u => u.id === id)[0];
    if (user) return user;
    else throw Errors.UserNotFound;
  }

  async fetchIdsWithoutStats(ids: string[]): Promise<User[]> {
    const query = UserModel.find({
      $or: ids.map(id => ({
        id
      }))
    });
    const users = await query.exec();
    return users.map(u => (u as any)._doc);
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

  async contacts(id: string): Promise<User[]> {
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
    return this.fetchIdsWithoutStats(userIds);
  }

  async waiting(): Promise<User[]> {
    const users = await this.all();
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
