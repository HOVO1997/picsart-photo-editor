import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import Cropper from 'cropperjs';
import ViewMode = Cropper.ViewMode;
import {PicsartImageEditorService} from "./picsart-image-editor.service";

@Component({
  selector: 'picsart-image-editor',
  templateUrl: './picsart-image-editor.component.html',
  styleUrls: ['./picsart-image-editor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PicsartImageEditorComponent implements OnInit{
  isVisible = false;
  @ViewChild('ngxPhotoEditorContent', {static: false}) content: any;
  @ViewChild('colorPicker') colorPicker!: ElementRef;
  public type!: string;
  public cropper!: Cropper;
  public outputImage!: string;
  private data!: FormData;
  prevZoom = 0;
  ref: any;
  @Input() modalTitle = 'Editor';
  @Input() hideModalHeader = false;
  @Input() aspectRatio = 1;
  @Input() autoCropArea = 1;
  @Input() autoCrop = true;
  @Input() mask = true;
  @Input() guides = true;
  @Input() centerIndicator = true;
  @Input() viewMode: ViewMode = 0;
  @Input() modalSize!: size;
  @Input() modalCentered = false;
  @Input() scalable = true;
  @Input() zoomable = true;
  @Input() cropBoxMovable = true;
  @Input() cropBoxResizable = true;
  @Input() darkTheme = true;
  @Input() roundCropper = false;
  @Input() canvasHeight = 400;

  @Input() resizeToWidth!: number;
  @Input() resizeToHeight!: number;
  @Input() imageSmoothingEnabled = true;
  @Input() imageSmoothingQuality: ImageSmoothingQuality = 'high';
  @Output() sendCroppedImage = new EventEmitter();
  @Input() picsartApiKey!: string;
  @Input() picsartUrl!: string;
  url!: string;
  lastUpdate = Date.now();

  format = 'png';
  quality = 92;

  isFormatDefined = false;

  @Output() imageCropped = new EventEmitter<CroppedEvent>();
  imageLoaded = false;

  constructor(
    private ngxPhotoEditorService: PicsartImageEditorService,
  ) {
  }

  ngOnInit(): void {
    this.data = new FormData();
    this.data.append('bg_blur', '0');
    this.data.append('scale', 'fit');
    this.data.append('bg_color', '');
    this.data.append('bg_image_url', '');
    this.data.append('format', '');
    this.data.append('output_type', '');
    this.data.append('bg_image_id', '');
    this.data.append('bg_size', '');
    this.data.append('image_id', '');
    }

  @Input() set imageQuality(value: number) {
    if (value > 0 && value <= 100) {
      this.quality = value;
    }
  }

  @Input() set imageFormat(type: imageFormat) {
    if ((/^(gif|jpe?g|tiff|png|webp|bmp)$/i).test(type)) {
      this.format = type;
      this.isFormatDefined = true;
    }
  }

  @Input() set imageUrl(url: string) {
    if (url) {
      this.url = url;
      if (this.lastUpdate !== Date.now()) {
        this.open();
        this.lastUpdate = Date.now();
      }
    }
  }

  @Input() set imageBase64(base64: string) {
    if (base64 && (/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/).test(base64)) {
      this.imageUrl = base64;
      if (!this.isFormatDefined) {
        this.format = ((base64.split(',')[0]).split(';')[0]).split(':')[1].split('/')[1];
      }
    }
  }

  @Input() set imageChangedEvent(event: any) {
    if (event) {
      const file = event.target.files[0];
      if (file && (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(file.name)) {
        if (!this.isFormatDefined) {
          this.format = event.target.files[0].type.split('/')[1];
        }
        const reader = new FileReader();
        reader.onload = (ev: any) => {
          this.imageUrl = ev.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  @Input() set imageFile(file: File) {
    if (file && (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(file.name)) {
      if (!this.isFormatDefined) {
        this.format = file.type.split('/')[1];
      }
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        this.imageUrl = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageLoad(image: any) {
    image.addEventListener('ready', () => {
      if (this.roundCropper) {
        (document.getElementsByClassName('cropper-view-box')[0] as HTMLElement).style.borderRadius = '50%';
        (document.getElementsByClassName('cropper-face')[0] as HTMLElement).style.borderRadius = '50%';
      }
      this.imageLoaded = true;
    });

    this.cropper = new Cropper(image, {
      aspectRatio: this.aspectRatio,
      autoCropArea: this.autoCropArea,
      autoCrop: this.autoCrop,
      modal: this.mask, // black mask
      guides: this.guides, // grid
      center: this.centerIndicator, // center indicator
      viewMode: this.viewMode,
      scalable: this.scalable,
      zoomable: this.zoomable,
      cropBoxMovable: this.cropBoxMovable,
      cropBoxResizable: this.cropBoxResizable,
    });
  }

  rotateRight() {
    this.cropper.rotate(45);
  }

  rotateLeft() {
    this.cropper.rotate(-45);
  }

  crop() {
    this.cropper.setDragMode('crop');
  }

  move() {
    this.cropper.setDragMode('move');
  }

  zoom(event: any) {
    const value = Number(event.target.value);
    this.cropper.zoom(value - this.prevZoom);
    this.prevZoom = value;
  }

  zoomIn() {
    this.cropper.zoom(0.1);
  }

  zoomOut() {
    this.cropper.zoom(-0.1);
  }

  flipH() {
    this.cropper.scaleX(-this.cropper.getImageData().scaleX);
  }

  flipV() {
    this.cropper.scaleY(-this.cropper.getImageData().scaleY);
  }

  reset() {
    this.cropper.reset();
  }

  export(arg: string): any {
    let cropedImage;
    if (this.resizeToWidth && this.resizeToHeight) {
      cropedImage = this.cropper.getCroppedCanvas({
        width: this.resizeToWidth,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality
      });
    } else if (this.resizeToHeight) {
      cropedImage = this.cropper.getCroppedCanvas({
        height: this.resizeToHeight,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality
      });
    } else if (this.resizeToWidth) {
      cropedImage = this.cropper.getCroppedCanvas({
        width: this.resizeToWidth,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality
      });
    } else {
      cropedImage = this.cropper.getCroppedCanvas({
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality
      });
    }
    this.outputImage = cropedImage.toDataURL('image/' + this.format, this.quality);
    cropedImage.toBlob((blob: any) => {
      this.imageCropped.emit({
        base64: this.outputImage,
        file: new File([blob], Date.now() + '.' + this.format, {type: 'image/' + this.format})
      });
    }, 'image/' + this.format, this.quality / 100);
    this.imageLoaded = false;
    if (arg === 'changeBG') {
      this.imageLoaded = true;
      return this.outputImage;
    }
  }

  open() {
    this.isVisible = true;
  }

  handleOk(): void {
    this.passBack();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.imageLoaded = false;
  }


  public choose(event: any, type: any): void {
    this.type = type;
  }

  onBackgroundUpload(event: any): void {
    this.data.append('bg_image', event.target.files[0], event.target.files[0].name);
  }

  onColorUpload(event: any): void {
    this.colorPicker.nativeElement.style['background-color'] = event.target.value;
    this.data.append('bg_color', event.target.value);
  }

  passBack() {
    if (this.type) {
      const image = this.export('changeBG');
      const file = this.DataURIToBlob(image);
      this.data.append('image', file, 'image.jpg');
      if (this.type === 'background') {
        this.data.delete('bg_color');
        this.data.append('bg_color', '#000000');
      } else {
        this.data.delete('bg_image');
        this.data.append('bg_image', '');
      }
      this.ngxPhotoEditorService.picsartBackgroundChange(this.data, this.picsartApiKey, this.picsartUrl).subscribe(res => {
        this.isVisible = false;
        this.sendCroppedImage.emit(res.data);
      });
    }else{
      this.export('img');
      this.isVisible = false;
    }
  }

  private DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }
}

export interface CroppedEvent {
  base64?: string;
  file?: File;
}

export type imageFormat = 'gif' | 'jpeg' | 'tiff' | 'png' | 'webp' | 'bmp';

export type size = 'sm' | 'lg' | 'xl' | string;
