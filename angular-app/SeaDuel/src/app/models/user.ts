import { DateTime } from "luxon";

import { Message } from "./message";
import { Game } from "./game";

export enum UserType {
  User,
  Administrator
}

export enum UserState {
  Offline,
  Online,
  Playing,
  None
}

export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public role: UserType = UserType.User,
    public registrationDate: DateTime = null,
    public state: UserState = UserState.None,
    public friends: string[] = [],

    // Chat
    public conversation: string[] = [],
    // public hasUnreadMessages: boolean = false,

    // Games
    public games: string[] = [],
    // public hasUnreadGames: boolean = false,

    // Stats
    public wonGames: number = 0,
    public lostGames: number = 0,
    public playedGames: number = 0,
    public position: number = 0
  ) {}
}
