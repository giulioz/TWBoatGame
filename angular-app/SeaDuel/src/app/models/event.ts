export enum EventType {
  IncomingMessage,
  IncomingGameRequest,
  GameStateChanged,
  GameBoardChanged
}

export class Event<T> {
  constructor(
    public type: EventType,
    public data: T
  ) {}
}
