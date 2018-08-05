import { Pipe, PipeTransform } from "@angular/core";

import { UserState } from "../models/user";

@Pipe({
  name: "userstatusColor"
})
export class UserstatusColorPipe implements PipeTransform {
  transform(value: UserState, args?: any): string {
    if (value === UserState.None) {
      return "#000000";
    } else if (value === UserState.Offline) {
      return "rgb(164, 172, 180)";
    } else if (value === UserState.Online) {
      return "#14FF00";
    } else if (value === UserState.Playing) {
      return "#FF0000";
    }
  }
}
