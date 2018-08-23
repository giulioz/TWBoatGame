import { Component, OnInit, Input } from "@angular/core";
import { MessagingService, Message } from "../../../swagger";
import { Observable } from "rxjs";
import { EventsService, EventType } from "../../services/events.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  userId: string;
  messageBoxContent: string;
  messages: Observable<Message[]>;

  constructor(
    private messaggingService: MessagingService,
    private eventsService: EventsService,
    private route: ActivatedRoute
  ) {}

  isUser(message: Message) {
    return message.recipientId === this.userId;
  }

  messageSend() {
    this.messaggingService
      .usersByIdIdMessagesPost(this.userId, { content: this.messageBoxContent })
      .subscribe(_ => {
        this.messageBoxContent = "";
      });
  }

  loadMessages = () => {
    this.messages = this.messaggingService.usersByIdIdMessagesGet(this.userId);
  };

  ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params.id) {
        this.userId = params.id;

        this.loadMessages();

        const eventStream = await this.eventsService.getEvents();
        eventStream.subscribe(event => {
          if (event.type === EventType.IncomingMessage) {
            this.loadMessages();
          }
        });
      }
    });
  }
}
