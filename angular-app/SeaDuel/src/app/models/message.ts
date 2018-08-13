import { DateTime } from "luxon";

export class Message {
  constructor(
    public messageId: string,
    public senderId: string,
    public recipientId: string,
    public content: string,
    public time: DateTime,
    public readt: boolean
  ) {}
}
