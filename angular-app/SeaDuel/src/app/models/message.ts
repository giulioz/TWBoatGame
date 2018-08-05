import { DateTime } from "luxon";

export class Message {
  constructor(
    public senderId: string,
    public recipientId: string,
    public content: string,
    public time: DateTime,
    public readt: boolean
  ) {}
}
