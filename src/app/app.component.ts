import { Component } from '@angular/core';
import {CroppedEvent} from "picsart-image-editor";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  base64: any;
  imageChangedEvent: any;
  imageUrl: any;
  api = 'tZcPbiBMqiCjoX0GKF8lb6TCRP3Y7TGx';
  picsartUrl = 'https://api.picsart.io/tools/demo/removebg';
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }


  imageCropped(event: CroppedEvent) {
    console.log('a')
    this.base64 = event.base64;
  }

  getImage(image: any): void {
    console.log('b')
    this.base64 = image.url;
  }


  constructor() {}



}
