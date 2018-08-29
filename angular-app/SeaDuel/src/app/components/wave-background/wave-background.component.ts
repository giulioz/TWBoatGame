import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-wave-background",
  templateUrl: "./wave-background.component.html",
  styleUrls: ["./wave-background.component.css"]
})
export class WaveBackgroundComponent implements OnInit {
  @Input()
  height?: number;
  @Input()
  strong: boolean;

  constructor() {}

  ngOnInit() {
    if (this.height) {
      document.getElementById("water").style.transform =
        "translate(0" + "," + this.height + ")";
    }
  }
}
