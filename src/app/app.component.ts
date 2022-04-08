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
  api = '2yFftArNa4Qlqqu5t0Ahgzb5gEvFBf55';
  picsartUrl = 'https://api.picsart.io/tools/demo/removebg';
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }


  imageCropped(event: CroppedEvent) {
    console.log(event)
    this.base64 = event.base64;
  }

  onClose(event: boolean): void {
    console.log(event)
  }


  constructor() {}



}
