import { DateTime } from "luxon";

export interface Message {
  senderId: string;
  recipientId: string;
  content: string;
  time: DateTime;
  readt: boolean;
}

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
      (a, b) => a.time.toMillis() - b.time.toMillis()
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
    const message: Message = {
      senderId,
      recipientId,
      content,
      time: DateTime.local(),
      readt: false
    };

    messages.push(message);
    return message;
  }
}

export default MessagesService;
