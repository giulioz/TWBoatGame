import { DateTime } from "luxon";
import { Hash, createHash } from "crypto";

interface User {
  id: string;
  email: string;
  password: string;
  role: "user" | "administrator";
  registrationDate: DateTime;
  state: "offline" | "online" | "playing";
  wonGames: number;
  lostGames: number;

  // Calculated
  position?: number;
}

const users: User[] = [];

function calculateUsersStats(users: User[]) {
  const kd = (u: User) => u.wonGames / (u.wonGames + u.lostGames);

  return users
    .sort((a, b) => kd(a) - kd(b))
    .map((u, i) => ({ ...u, position: i }));
}

export class UsersService {
  async all(): Promise<User[]> {
    return Promise.resolve(calculateUsersStats(users));
  }

  async byId(id: string): Promise<User> {
    const all = await this.all();
    return all.find(u => u.id === id);
  }

  async create(user: {
    id: string;
    email: string;
    password: string;
  }): Promise<User> {
    const hash = createHash("sha256");
    hash.update(user.password + process.env.SALT);

    const userToSave: User = {
      id: user.id,
      email: user.email,
      password: hash.digest("hex"),
      role: "user",
      registrationDate: DateTime.local(),
      state: "offline",
      wonGames: 0,
      lostGames: 0
    };

    users.push(userToSave);
    return Promise.resolve(userToSave);
  }
}

export default new UsersService();
