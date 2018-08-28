import { connect } from "mongoose";
import { prop, Typegoose, arrayProp } from "typegoose";

export class User extends Typegoose {
  @prop({ required: true, unique: true })
  id: string;

  @prop({ required: true, unique: true })
  email: string;
  @prop()
  password: string;
  @prop({ default: "user" })
  role: "user" | "administrator";
  @prop()
  registrationDate: string;
  @prop({ default: 0 })
  wonGames: number;
  @prop({ default: 0 })
  lostGames: number;
  @prop()
  lastActivity: string;
  @prop()
  playing: boolean;

  // Calculated
  position: number;
  state: "offline" | "online";
  hasUnreadMessages: boolean;
  hasUnreadGames: boolean;
}

export class Message extends Typegoose {
  @prop()
  senderId: string;
  @prop()
  recipientId: string;
  @prop()
  content: string;
  @prop()
  time: string;
  @prop()
  readt: boolean;
}

export enum BoardElementType {
  Empty = "Empty",
  Destroyer = "Destroyer",
  Submarine = "Submarine",
  Battleship = "Battleship",
  AircraftCarrier = "AircraftCarrier"
}

export class BoardElement {
  @prop({ enum: BoardElementType })
  type: BoardElementType;
  @prop()
  checked: boolean;
}

export class GameBoard {
  @arrayProp({ items: BoardElement })
  boardData: BoardElement[];
  @prop({ default: 10 })
  width: number;
  @prop({ default: 10 })
  height: number;
}

export enum GameStateType {
  WaitingForResponse = "WaitingForResponse",
  HasToRespond = "HasToRespond",
  BoatsPositioning = "BoatsPositioning",
  PlayerTurn = "PlayerTurn",
  OpponentTurn = "OpponentTurn",
  Ended = "Ended"
}

export class Boat {
  @prop({ enum: BoardElementType })
  type: BoardElementType;
  @prop()
  amount: number;
}

export class Game extends Typegoose {
  @prop({ enum: GameStateType })
  state: GameStateType;
  @prop()
  playerId: string;
  @prop()
  opponentId: string;
  @prop()
  winnerId: string;
  @prop()
  playerBoard: GameBoard;
  @prop()
  opponentBoard: GameBoard;
  @prop()
  playerReady: boolean;
  @prop()
  opponentReady: boolean;
  @prop()
  startTime: string;
  @arrayProp({ items: Boat })
  playerAvailableBoats: Boat[];
  @arrayProp({ items: Boat })
  opponentAvailableBoats: Boat[];
}

export const UserModel = new User().getModelForClass(User);
export const GameModel = new Game().getModelForClass(Game);
export const MessageModel = new Message().getModelForClass(Message);

export default class DbService {
  async connectDb(url: string) {
    await connect(url);
  }
}
