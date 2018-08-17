import { createHash } from "crypto";
import { verify, sign } from "jsonwebtoken";
import { UsersService, User } from "./users.service";
import { DateTime } from "luxon";

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

export async function sameAuthCheck(authService: AuthService, req: Request) {

}

export async function userAuthCheck(authService: AuthService, req: Request) {

}

export async function adminAuthCheck(authService: AuthService, req: Request) {
  
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
      return sign(genAuthToken(user), secret);
    } else {
      throw "Invalid Credentials";
    }
  }

  async checkToken(token: string): Promise<void> {
    try {
      verify(token, secret);
    } catch (err) {
      throw "Invalid Token";
    }
  }
}

export default AuthService;
