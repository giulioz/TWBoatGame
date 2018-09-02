import { createHash } from "crypto";
import { verify, sign } from "jsonwebtoken";
import { UsersService } from "./users.service";
import { DateTime } from "luxon";
import { Request } from "express";
import { User } from "./db.service";

const secret = process.env.SECRET;

export interface AuthToken {
  id: string;
  email: string;
  loginTime: DateTime;
  role: "user" | "administrator";
}

export function hashPassword(password: string) {
  const hash = createHash("sha256");
  hash.update(password + process.env.SALT);
  return hash.digest("hex");
}

function genAuthToken(user: User): AuthToken {
  return {
    id: user.id,
    email: user.email,
    loginTime: DateTime.local(),
    role: user.role
  };
}

export async function authCheck(authService: AuthService, req: Request) {
  try {
    return authService.checkToken(req.headers.authorization);
  } catch {
    return null;
  }
}

export class AuthService {
  constructor(private usersService: UsersService) {}

  async auth(id: string, password: string): Promise<string> {
    const hash = createHash("sha256");
    hash.update(password + process.env.SALT);

    let user;
    try {
      user = await this.usersService.byId(id);
    } catch {
      throw "User not found";
    }

    if (user.password === hash.digest("hex")) {
      return "Bearer " + sign(genAuthToken(user), secret);
    } else {
      throw "Invalid Credentials";
    }
  }

  async checkToken(token: string): Promise<AuthToken> {
    try {
      const auth = verify(token.split(" ")[1], secret) as AuthToken;

      await this.usersService.byId(auth.id);

      // for online / offline detection
      this.usersService.touchLastActivity(auth.id);

      return auth;
    } catch (err) {
      throw "Invalid Token";
    }
  }
}

export default AuthService;
