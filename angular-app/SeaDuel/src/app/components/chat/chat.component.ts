import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnChanges
} from "@angular/core";
import { MessagingService, Message } from "../../../swagger";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements AfterViewInit, OnChanges, OnInit {
  @Input()
  opponentId: string;
  @Input()
  messages: Message[];

  messageBoxContent: string;

  constructor(private messaggingService: MessagingService) {}

  isUser(message: Message) {
    return message.recipientId === this.opponentId;
  }

  scrollToTop() {
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

  ngOnInit() {
    // UGLY HACK
    setTimeout(this.scrollToTop, 100);
  }

  ngOnChanges() {
    setTimeout(this.scrollToTop, 100);
  }

  ngAfterViewInit() {
    setTimeout(this.scrollToTop, 100);
  }
}
