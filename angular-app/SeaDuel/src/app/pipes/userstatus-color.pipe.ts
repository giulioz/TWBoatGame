import { Pipe, PipeTransform } from "@angular/core";
import { User } from "../../swagger";

@Pipe({
  name: "userstatusColor"
})
export class UserstatusColorPipe implements PipeTransform {
  transform(value: User, args?: any): string {
    if (value.state === "offline") {
      return "rgb(164, 172, 180)";
    // } else if (value.playing) {
      // return "#FF0000";
    } else if (value.state === "online") {
      return "#14FF00";
    } else {
      return "#000000";
    }
  }
}
