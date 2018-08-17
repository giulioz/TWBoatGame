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

function genAuthToken(user: User) : AuthToken {
  return {
    id: user.id,
    email: user.email,
    loginTime: DateTime.local(),
    role: user.role
  }
}

export async function isSameUser(authService: AuthService, req: Request, userId: string) {
  try {
    const authToken = await authService.checkToken(req.headers.authorization);
    return authToken.id === userId;
  } catch {
    return false;
  }
}

export async function userAuthCheck(authService: AuthService, req: Request) {
  try {
    const authToken = await authService.checkToken(req.headers.authorization);
    return authToken.role === "user";
  } catch {
    return false;
  }
}

export async function adminAuthCheck(authService: AuthService, req: Request) {
  try {
    const authToken = await authService.checkToken(req.headers.authorization);
    return authToken.role === "administrator";
  } catch {
    return false;
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
      return verify(token.split(" ")[1], secret) as AuthToken;
    } catch (err) {
      throw "Invalid Token";
    }
  }
}

export default AuthService;
