import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const video = document.getElementsByTagName("video")[0];
    video.height = document.getElementsByClassName(
      "splash-container"
    )[0].clientHeight;
    video.play();

    const videoCarousel = document.getElementsByClassName(
      "carousel-back"
    )[0] as HTMLVideoElement;
    videoCarousel.style.top =
      document
        .getElementsByClassName("carousel-container")[0]
        .getBoundingClientRect().top -
      100 +
      "px";
    videoCarousel.play();
  }
}
