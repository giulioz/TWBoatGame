import { Component, OnInit, Input } from "@angular/core";
import { MessagingService, Message } from "../../../swagger";
import { Observable } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  @Input()
  opponentId: string;
  @Input()
  messages: Observable<Message[]>;

  messageBoxContent: string;

  constructor(private messaggingService: MessagingService) {}

  isUser(message: Message) {
    return message.recipientId === this.opponentId;
  }

  messageSend() {
    this.messaggingService
      .usersByIdIdMessagesPost(this.opponentId, { content: this.messageBoxContent })
      .subscribe(_ => {
        this.messageBoxContent = "";
      });
  }

  ngOnInit() {}
}
