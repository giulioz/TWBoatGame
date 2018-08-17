import { DateTime } from "luxon";
import { Message, MessageModel } from "./db.service";

// TODO: persistance
const messages: Message[] = [];

export class MessagesService {
  async all(): Promise<Message[]> {
    return messages;
  }

  async conversation(a: string, b: string): Promise<Message[]> {
    const fromA = messages.filter(m => m.senderId === a && m.recipientId === b);
    const fromB = messages.filter(m => m.senderId === b && m.recipientId === a);
    return [...fromA, ...fromB].sort(
      (a, b) => DateTime.fromRFC2822(a.time).toMillis() - DateTime.fromRFC2822(b.time).toMillis()
    );
  }

  async conversationSetRead(a: string, b: string): Promise<void> {
    messages.forEach(m => {
      if (
        (m.senderId === a && m.recipientId === b) ||
        (m.senderId === b && m.recipientId === a)
      ) {
        m.readt = true;
      }
    });
  }

  async send(
    senderId: string,
    recipientId: string,
    content: string
  ): Promise<Message> {
    const message: Message = new MessageModel({
      senderId,
      recipientId,
      content,
      time: DateTime.local().toRFC2822(),
      readt: false
    });

    messages.push(message);
    return message;
  }
}

export default MessagesService;
