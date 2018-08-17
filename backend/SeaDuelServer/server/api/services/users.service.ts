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

  // TODO: persistance
  users: User[] = [
    new UserModel({
      id: "giulioz",
      email: "none",
      password:
        "873d570a0c7f121bd0dd9b2f274156bf694ebc07561d17b94b8cd726db3b37c2",
      role: "user",
      registrationDate: DateTime.local().toRFC2822(),
      wonGames: 0,
      lostGames: 0,
      lastActivity: DateTime.local().toRFC2822(),
      position: NaN,
      state: "offline"
    })
  ];

  async all(): Promise<User[]> {
    return calculateUsersStats(this.users);
  }

  async byId(id: string): Promise<User> {
    const user = calculateUsersStats(this.users).filter(u => u.id === id)[0];
    if (user) return user;
    else throw Errors.UserNotFound;
  }

  async create(id: string, email: string, password: string): Promise<User> {
    if (this.users.filter(u => u.id === id || u.email === email)) {
      throw Errors.UserExists;
    }

    const userToSave: User = new UserModel({
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

    this.users.push(userToSave);
    return userToSave;
  }

  async update(user: User): Promise<User> {
    const found = calculateUsersStats(this.users).filter(
      u => u.id === user.id
    )[0];
    if (!found) {
      throw Errors.UserNotFound;
    }

    const userToSave = new UserModel({ ...found, ...user, position: NaN });

    if (user.password !== "") {
      userToSave.password = hashPassword(user.password);
    }

    return userToSave;
  }

  async touchLastActivity(id: string): Promise<void> {
    this.users.find(u => u.id === id).lastActivity = DateTime.local().toRFC2822();
    return Promise.resolve();
  }
}

export default UsersService;
