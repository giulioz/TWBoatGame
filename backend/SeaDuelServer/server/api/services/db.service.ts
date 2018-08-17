import { connect } from "mongoose";
import { prop, Typegoose, arrayProp, Ref } from "typegoose";

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

  // Calculated
  position: number;
  state: "offline" | "online" | "playing";
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
  AircraftCarrier = "AircraftCarrier",
  Hidden = "Hidden"
}

export class BoardElement extends Typegoose {
  @prop({ enum: BoardElementType })
  type: BoardElementType;
  @prop()
  checked: boolean;
}

export class GameBoard extends Typegoose {
  @arrayProp({ itemsRef: BoardElement })
  boardData: Ref<BoardElement>[][];
  @prop({ default: 10 })
  width: number;
  @prop({ default: 10 })
  height: number;
}

export enum GameStateType {
  WaitingForResponse = "WaitingForResponse",
  Rejected = "Rejected",
  BoatsPositioning = "BoatsPositioning",
  PlayerTurn = "PlayerTurn",
  OpponentTurn = "OpponentTurn",
  Ended = "Ended"
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
  @prop({ ref: GameBoard })
  playerBoard: Ref<GameBoard>;
  @prop({ ref: GameBoard })
  opponentBoard: Ref<GameBoard>;
  @prop()
  playerReady: boolean;
  @prop()
  opponentReady: boolean;
  @prop()
  startTime: string;
}

export const UserModel = new User().getModelForClass(User);
export const GameModel = new Game().getModelForClass(Game);
export const GameBoardModel = new GameBoard().getModelForClass(GameBoard);
export const MessageModel = new Message().getModelForClass(Message);

export default class DbService {
  async connectDb(url: string) {
    await connect(url);
  }
}
