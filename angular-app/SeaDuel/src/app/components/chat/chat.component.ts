import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { MessagingService, Message } from "../../../swagger";
import { Observable } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit, OnChanges {
  @Input()
  opponentId: string;
  @Input()
  messages: Message[];

  messageBoxContent: string;

  constructor(private messaggingService: MessagingService) {}

  isUser(message: Message) {
    return message.recipientId === this.opponentId;
  }

  ngOnChanges(changes: SimpleChanges) {
    const element = document.getElementById("scroller");
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }

  messageSend() {
    this.messaggingService
      .usersByIdIdMessagesPost(this.opponentId, {
        content: this.messageBoxContent
      })
      .subscribe(_ => {
        this.messageBoxContent = "";
      });
  }

  ngOnInit() {}
}
