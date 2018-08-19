import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

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
  constructor(private authService: AuthService) {}

  async getEvents() {
    return new Promise<Observable<Event>>(resolve => {
      const socket = io(environment.socketUrl);

      socket.on("connect", () => {
        socket.on("authenticated", () => {
          console.log("socket auth ok");
        });

        socket.emit("authentication", this.authService.getToken());

        const eventStream = new Observable<Event>(observer => {
          socket.on("event", (event: string) => {
            observer.next(JSON.parse(event));
          });
        });

        resolve(eventStream);
      });
    });
  }
}
