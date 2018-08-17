import { DateTime, Duration } from "luxon";
import { hashPassword } from "./auth.service";
import GamesService from "./games.service";
import { User, UserModel } from "./db.service";

export enum Errors {
  UserNotFound,
  UserExists
}

const lastActivityOnlineThreshold = Duration.fromObject({ minutes: parseInt(process.env.OFFLINE_MINUTES) }).as(
  "milliseconds"
);

const kd = (u: User) => u.wonGames / (u.wonGames + u.lostGames);

const state = (u: User, gamesService: GamesService): "offline" | "online" | "playing" => {
  const lastActivityTime =
    DateTime.local().toMillis() - DateTime.fromISO(u.lastActivity).toMillis();
  const isOnline = lastActivityTime < lastActivityOnlineThreshold;
  const isPlaying = false; // TODO: check with gamesService
  return isOnline ? (isPlaying ? "playing" : "online") : "offline";
};

function calculateUsersStats(users: User[], gamesService: GamesService) {
  return users
    .sort((a, b) => kd(a) - kd(b))
    .map((u, i) => ({ ...(u as any)._doc, position: i, state: state(u, gamesService) }));
}

export class UsersService {
  constructor(private gamesService: GamesService) {}

  async all(): Promise<User[]> {
    const query = UserModel.find();
    const users = await query.exec();
    return calculateUsersStats(users, this.gamesService);
  }

  async byId(id: string): Promise<User> {
    const users = await this.all();
    const user = users.filter(u => u.id === id)[0];
    if (user) return user;
    else throw Errors.UserNotFound;
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
      lastActivity: DateTime.local().toISO()
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

  async touchLastActivity(id: string): Promise<void> {
    const updateQuery = UserModel.updateOne(
      { id },
      { lastActivity: DateTime.local().toISO() }
    );
    return updateQuery.exec();
  }
}

export default UsersService;
