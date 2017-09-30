import { Component, OnInit, ElementRef } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
declare var MediaRecorder: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public videosrc: any;
  buffer = [];
  theRecorder;
  theStream;
  constructor(private sanitizer:  DomSanitizer, private element: ElementRef) {
  }

  ngOnInit() {
}

  public showCam() {
    const nav = <any>navigator;
    nav.getUserMedia = (nav.getUserMedia ||
      nav.webkitGetUserMedia ||
      nav.mozGetUserMedia ||
      nav.msGetUserMedia);
    const promise = new Promise<string>((resolve, reject) => {
          nav.getUserMedia({video: true, audio: true}, (stream) => {
              resolve(stream);
          }, (err) => reject(err));

      }).then((stream) => {this.gotMedia(stream); }).catch((error) => {
          console.log(error);
      });

  }
  gotMedia(stream) {
    this.theStream = stream;
    const video = this.element.nativeElement.querySelector('video');
    video.srcObject = (stream);
    try {
      video.play();
      this.theRecorder = new MediaRecorder(stream, {mimeType : 'video/webm'});
      this.theRecorder.ondataavailable =
          (event) => { this.buffer.push(event.data); };
      this.theRecorder.start(100);
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e);
      return;
    }

  }
  download() {
    this.theRecorder.stop();
    this.theStream.getTracks().forEach(track => { track.stop(); });
    const blob = new Blob(this.buffer, {type: 'video/webm'});
    const url =  URL.createObjectURL(blob);
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.webm';
    a.click();
    // setTimeout() here is needed for Firefox.
    this.playdeoVideo();

      // URL.revokeObjectURL(url);

  }
  playdeoVideo() {
    const superBuffer = new Blob(this.buffer);
    const video = this.element.nativeElement.querySelector('video');
    video.src =
      window.URL.createObjectURL(superBuffer);
    video.play();
  }
}
