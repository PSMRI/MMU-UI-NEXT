/*
 * AMRIT – Accessible Medical Records via Integrated Technology
 * Integrated EHR (Electronic Health Records) Solution
 *
 * Copyright (C) "Piramal Swasthya Management and Research Institute"
 *
 * This file is part of AMRIT.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  DoCheck,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from '../../services/http-service.service';
import { ConfirmationService } from '../../services';
import { SetLanguageComponent } from '../set-language.component';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/internal/Subject';
import { ChartData, ChartType } from 'chart.js';
import html2canvas from 'html2canvas';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable } from 'rxjs';

interface mark {
  xCord: any;
  yCord: any;
  description: any;
  point: any;
}

@Component({
  selector: 'app-camera-dialog',
  templateUrl: './camera-dialog.component.html',
  styleUrls: ['./camera-dialog.component.css'],
})
export class CameraDialogComponent implements OnInit, DoCheck {
  @Output() cancelEvent = new EventEmitter();

  @ViewChild('myCanvas')
  myCanvas!: ElementRef;
  @ViewChild('myImg')
  myImg!: ElementRef;

  status: any;
  public imageCode: any;
  public availablePoints: any;
  public annotate: any;
  public title!: string;
  public capture = false;
  public captured: any = false;
  public webcam: any;
  public graph: any;
  base64: any;
  error: any;
  options: any;
  canvas: any;
  pointsToWrite: Array<any> = [];
  markers: mark[] = [];
  ctx!: CanvasRenderingContext2D;
  loaded = false;
  public current_language_set: any;
  private trigger: Subject<any> = new Subject();
  triggerObservable: Subject<void> = new Subject<void>();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  public barChartType: ChartType = 'bar';
  sysImage = '';
  public barChartData: ChartData<any> = {
    datasets: [
      {
        backgroundColor: ['red', 'green', 'blue'],
      },
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<CameraDialogComponent>,
    private element: ElementRef,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService
    // public webcamInitError: WebcamInitError
  ) {
    this.options = {
      audio: false,
      video: true,
      //fallback: true,//force flash
      width: 500,
      height: 390,
      fallbackMode: 'callback',
      fallbackSrc: 'jscam_canvas_only.swf',
      fallbackQuality: 50,
      cameraType: 'back',
    };
  }

  onSuccess(stream: any) {
    console.log('capturing video stream');
  }

  onError(err: any) {
    console.log(err);
  }

  captureBase64() {
    if (!this.captured) {
      this.status = this.current_language_set.retry;
      return this.webcam
        .getBase64()
        .then((base: any) => {
          this.captured = new Date();
          this.base64 = base;
          setTimeout(() => this.webcam.resizeVideo(), 0);
        })
        .catch((e: any) => console.error(e));
    } else {
      this.captured = false;
      this.status = this.current_language_set.capture;
    }
  }

  public getSnapshot(): void {
    this.trigger.next(void 0);
  }

  ngOnInit() {
    // console.log(this.current_language_set);
    this.assignSelectedLanguage();
    this.loaded = false;
    this.status = this.current_language_set.capture;
    //console.log(this.availablePoints );
    if (this.availablePoints && this.availablePoints.markers)
      this.pointsToWrite = this.availablePoints.markers;
  }

  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    console.info('got webcam image', this.sysImage);
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  Confirm() {
    this.cancelEvent.emit(null);
  }

  AfterViewInit() {
    if (this.annotate) this.loadingCanvas();

    if (!this.loaded) {
      if (this.annotate) this.loadingCanvas();
      this.loaded = true;
    }
    // this.checkValues.forEach((value)=> {
    //   this.pointMark(value);
    // })
    if (this.pointsToWrite) this.loadMarks();
  }

  loadMarks() {
    //console.log(this.availablePoints, 'points');
    this.pointsToWrite.forEach(num => {
      this.pointMark(num);
    });
  }

  loadingCanvas() {
    this.canvas = this.myCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    const img = this.myImg.nativeElement;
    // console.log(img, 'img')
    this.ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.ctx.font = 'bold 20px serif';
    this.score = 1;
  }

  captureImage(webcamImage: WebcamImage): void {
    // Handle the captured image data
    this.webcamImage = webcamImage;
    this.base64 = webcamImage.imageAsDataUrl;
    this.captured = true;
  }
  handleKeyDownRecaptureImg(event: KeyboardEvent): void {
    if (event.key == 'Enter' || event.key == 'Spacebar' || event.key == ' ') {
      this.recaptureImage();
    }
  }

  recaptureImage(): void {
    // Trigger new image capture
    this.captured = false;
    this.triggerObservable.next();
  }

  handleInitError(error: WebcamInitError): void {
    // Handle webcam initialization error
    // this.webcamInitError = error;
  }

  score: any;
  pointMark(event: any) {
    if (event.xCord) event.offsetX = event.xCord;
    if (event.yCord) event.offsetY = event.yCord;
    if (this.score <= 6) {
      this.ctx.strokeRect(event.offsetX - 10, event.offsetY - 10, 20, 20);
      this.ctx.fillText(this.score, event.offsetX - 3, event.offsetY + 6);
      this.saveDescription(event);
    } else {
      setTimeout(() => {
        this.confirmationService.alert(
          this.current_language_set.alerts.info.sixMakers
        );
      }, 0);
    }
    // } else {
    //     this.ctx.strokeRect(event.offsetX-10, event.offsetY-10, 30, 20);
    //     this.ctx.fillText(this.score, event.offsetX-5, event.offsetY+6);
    // }
  }

  clearPointers() {
    this.markers.splice(0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.loadingCanvas();
    // console.log(this.markers);
  }

  saveDescription(event: any) {
    if (event.description) {
      this.markers.push({
        xCord: event.offsetX,
        yCord: event.offsetY,
        description: event.description,
        point: event.point,
      });
    } else {
      this.markers.push({
        xCord: event.offsetX,
        yCord: event.offsetY,
        description: '',
        point: this.score,
      });
    }
    this.score++;
  }

  getMarkers() {
    return {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      visitID: localStorage.getItem('visitID'),
      createdBy: localStorage.getItem('userName'),
      imageID: '',
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      markers: this.markers,
    };
  }

  downloadGraph() {
    const container = document.getElementById('container-dialog');

    if (container) {
      html2canvas(container)
        .then(canvas => {
          canvas.toBlob(blob => {
            if (blob) {
              try {
                const graphName =
                  `${this.graph.type}_${localStorage.getItem(
                    'beneficiaryRegID'
                  )}_${localStorage.getItem('visitID')}` || 'graphTrends';
                saveAs(blob, graphName);
              } catch (e) {
                console.error('Error saving image:', e);

                // Perform a null check before calling window.open
                const newWindow = window.open();
                if (newWindow) {
                  newWindow.document.write(
                    '<img src="' + canvas.toDataURL() + '" />'
                  );
                } else {
                  console.error('Error opening a new window.');
                }
              }
            } else {
              console.error('Blob is null.');
            }
          });
        })
        .catch(error => {
          console.error('Error capturing HTML element:', error);
        });
    } else {
      console.error('Element with ID "container-dialog" not found.');
    }
  }
}
