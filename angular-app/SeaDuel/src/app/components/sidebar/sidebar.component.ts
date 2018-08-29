import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../../swagger";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  open = false;
  userId: string;

  @Input()
  finds: User[];
  @Input()
  friends: User[];
  @Input()
  waiting: User[];
  @Input()
  top: User[];

  @Output()
  find: EventEmitter<string> = new EventEmitter();

  constructor(private router: Router, private authService: AuthService) {}

  selectUser = (userId: string) => {
    if (userId !== this.userId) {
      this.router.navigate(["/user/" + userId]);
    }
  };

  onFind = (userId: string) => {
    this.find.emit(userId);
  };

  ngOnInit() {
    this.userId = this.authService.getUserToken().id;
  }

  doOpen = () => {
    this.open = !this.open;
  }
}
