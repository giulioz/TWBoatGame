import { DateTime, Duration } from "luxon";
import { hashPassword } from "./auth.service";
import GamesService from "./games.service";

export interface User {
  id: string;
  email: string;
  password: string;
  role: "user" | "administrator";
  registrationDate: DateTime;
  wonGames: number;
  lostGames: number;
  lastActivity: DateTime;

  // Calculated
  position: number;
  state: "offline" | "online" | "playing";
}

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
    .minus(u.lastActivity)
    .toMillis();
  const isOnline = lastActivityTime < lastActivityOnlineThreshold;
  const isPlaying = false;
  return isOnline ? (isPlaying ? "playing" : "online") : "offline";
};

function calculateUsersStats(users: User[]) {
  return users
    .sort((a, b) => kd(a) - kd(b))
    .map((u, i) => ({ ...u, position: i, state: state(u) }));
}

export class UsersService {
  constructor(private gamesService: GamesService) {}

  // TODO: persistance
  users: User[] = [
    {
      id: "giulioz",
      email: "none",
      password:
        "873d570a0c7f121bd0dd9b2f274156bf694ebc07561d17b94b8cd726db3b37c2",
      role: "user",
      registrationDate: DateTime.local(),
      wonGames: 0,
      lostGames: 0,
      lastActivity: DateTime.local()
    } as any
  ];

  async all(): Promise<User[]> {
    return calculateUsersStats(this.users);
  }

  async byId(id: string): Promise<User> {
    const user = calculateUsersStats(this.users).find(u => u.id === id);
    if (user) return user;
    else throw Errors.UserNotFound;
  }

  async create(id: string, email: string, password: string): Promise<User> {
    if (this.users.find(u => u.id === id)) {
      throw Errors.UserExists;
    }

    const userToSave: User = {
      id,
      email,
      password: hashPassword(password),
      role: "user",
      registrationDate: DateTime.local(),
      state: "offline",
      wonGames: 0,
      lostGames: 0,
      position: NaN,
      lastActivity: DateTime.local()
    };

    this.users.push(userToSave);
    return userToSave;
  }

  async update(user: User): Promise<User> {
    const found = calculateUsersStats(this.users).find(u => u.id === user.id);
    if (!found) {
      throw Errors.UserNotFound;
    }

    const userToSave = { ...found, ...user, position: NaN };

    if (user.password !== "") {
      userToSave.password = hashPassword(user.password);
    }

    return userToSave;
  }

  async touchLastActivity(id: string): Promise<void> {
    this.users.forEach(u => {
      if (u.id === id) {
        u.lastActivity = DateTime.local();
      }
    });
    return Promise.resolve();
  }
}

export default UsersService;
