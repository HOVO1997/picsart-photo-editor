import { NgModule } from '@angular/core';
import { PicsartImageEditorComponent } from './picsart-image-editor.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {PicsartImageEditorService} from './picsart-image-editor.service';
import {CommonModule} from "@angular/common";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
  declarations: [
    PicsartImageEditorComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    NzModalModule,
    NzButtonModule,
  ],
  providers: [
    PicsartImageEditorService
  ],
  exports: [
    PicsartImageEditorComponent
  ],
})
export class PicsartImageEditorModule { }
