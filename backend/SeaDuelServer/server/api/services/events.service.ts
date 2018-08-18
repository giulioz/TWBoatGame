import * as io from "socket.io";
import { Server } from "http";
import * as auth from "socketio-auth";
import { AuthService } from "./auth.service";
import l from "../../common/logger";

export enum EventType {
  IncomingMessage = "IncomingMessage",
  GameChanged = "GameChanged"
}

export interface Event {
  type: EventType;
  userId: string;
}

export default class EventsService {
  socket: io.Server = null;

  usersTable: { [userId: string]: io.Socket } = {};

  initServer = (http: Server, authService: AuthService) => {
    this.socket = io(http);

    auth(this.socket, {
      authenticate: async (socket, data, callback) => {
        try {
          await authService.checkToken(data);
          return callback(null, true);
        } catch {
          return callback(null, false);
        }
      },
      postAuthenticate: async (socket, data) => {
        try {
          const user = await authService.checkToken(data);
          socket.client.userId = user.id;
          this.usersTable[user.id] = socket;
        } catch (err) {
          l.error(err);
        }
      },
      disconnect: async socket => {
        delete this.usersTable[socket.client.userId];
      }
    });
  };

  sendEvent = (event: Event, targetUserId: string) => {
    if (this.usersTable[targetUserId]) {
      this.usersTable[targetUserId].emit("event", JSON.stringify(event));
    }
  };
}
