import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export enum EventType {
  IncomingMessage = "IncomingMessage",
  GameChanged = "GameChanged"
}

export interface Event {
  type: EventType;
  userId: string;
}

@Injectable()
export class EventsService {
  socket: SocketIOClient.Socket;
  authenticated = false;
  eventStream: Observable<Event>;

  constructor() {
    this.socket = io(environment.socketUrl);
    this.socket.on("connect", () => {
      this.socket.on("authenticated", () => {
        this.authenticated = true;
      });
      this.eventStream = new Observable(observer => {
        this.socket.on("event", (event: string) => {
          observer.next(JSON.parse(event));
        });
      });
    });
  }

  authenticate(token: string) {
    this.socket.emit("authentication", token);
  }
}
