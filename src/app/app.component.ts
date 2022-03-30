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
  api = 'rGzBCoJSYmOvJAIFfzsETL5GTK1BG0sz';
  picsartUrl = 'https://api.picsart.io/tools/demo/removebg';
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }


  imageCropped(event: CroppedEvent) {
    console.log('a')
    this.base64 = event.base64;
  }




  constructor() {}



}
