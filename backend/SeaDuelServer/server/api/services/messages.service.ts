import { DateTime } from "luxon";
import { Message, MessageModel } from "./db.service";

export class MessagesService {
  async all(): Promise<Message[]> {
    const query = MessageModel.find();
    return query.exec();
  }

  async conversation(a: string, b: string): Promise<Message[]> {
    const query = MessageModel.find({
      $or: [{ senderId: a, recipientId: b }, { senderId: b, recipientId: a }]
    });
    const messages = await query.exec();
    return messages.sort(
      (a, b) =>
        DateTime.fromISO(a.time).toMillis() -
        DateTime.fromISO(b.time).toMillis()
    );
  }

  async conversationSetRead(a: string, b: string): Promise<void> {
    const query = MessageModel.update(
      {
        $or: [{ senderId: a, recipientId: b }, { senderId: b, recipientId: a }]
      },
      { readt: true }
    );
    return query.exec();
  }

  async send(
    senderId: string,
    recipientId: string,
    content: string
  ): Promise<Message> {
    return new MessageModel({
      senderId,
      recipientId,
      content,
      time: DateTime.local().toISO(),
      readt: false
    }).save();
  }
}

export default MessagesService;
