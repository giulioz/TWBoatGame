import { DateTime, Duration } from "luxon";
import { hashPassword } from "./auth.service";
import GamesService from "./games.service";
import { User, UserModel } from "./db.service";

export enum Errors {
  UserNotFound,
  UserExists
}

const lastActivityOnlineThreshold = Duration.fromObject({ minutes: 10 }).as(
  "milliseconds"
);

const kd = (u: User) => u.wonGames / (u.wonGames + u.lostGames);

const state = (u: User): "offline" | "online" | "playing" => {
  const lastActivityTime = DateTime.local()
    .minus(DateTime.fromRFC2822(u.lastActivity))
    .toMillis();
  const isOnline = lastActivityTime < lastActivityOnlineThreshold;
  const isPlaying = false;
  return isOnline ? (isPlaying ? "playing" : "online") : "offline";
};

function calculateUsersStats(users: User[]): User[] {
  return users
    .sort((a, b) => kd(a) - kd(b))
    .map((u, i) => new UserModel({ ...u, position: i, state: state(u) }));
}

export class UsersService {
  constructor(private gamesService: GamesService) {}

  async all(): Promise<User[]> {
    const query = UserModel.find();
    const users = await query.exec();
    return calculateUsersStats(users);
  }

  async byId(id: string): Promise<User> {
    const users = await this.all();
    const user = calculateUsersStats(users).filter(u => u.id === id)[0];
    if (user) return user;
    else throw Errors.UserNotFound;
  }

  async create(id: string, email: string, password: string): Promise<User> {
    const query = UserModel.count({ id, email });
    const exists = (await query.exec()) > 0;
    if (exists) {
      throw Errors.UserExists;
    }

    const userToSave = new UserModel({
      id,
      email,
      password: hashPassword(password),
      role: "user",
      registrationDate: DateTime.local().toRFC2822(),
      state: "offline",
      wonGames: 0,
      lostGames: 0,
      position: NaN,
      lastActivity: DateTime.local().toRFC2822()
    });

    await userToSave.save();

    return userToSave;
  }

  async update(user: User): Promise<void> {
    if (user.password !== "") {
      user.password = hashPassword(user.password);
    } else {
      delete user.password;
    }
    const updateQuery = UserModel.updateOne({ id: user.id }, { ...user });
    await updateQuery.exec();
  }

  async touchLastActivity(id: string): Promise<void> {
    const updateQuery = UserModel.updateOne(
      { id },
      { lastActivity: DateTime.local().toRFC2822() }
    );
    await updateQuery.exec();
  }
}

export default UsersService;
