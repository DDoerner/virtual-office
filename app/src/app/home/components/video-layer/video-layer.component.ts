import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { VideoController } from '../../services/video.controller';

@Component({
  selector: 'app-video-layer',
  templateUrl: './video-layer.component.html',
  styleUrls: ['./video-layer.component.scss'],
})
export class VideoLayerComponent implements OnInit, AfterViewInit, OnDestroy {

  public myStream: MediaStream = null;
  public remoteStream: MediaStream = null;

  public myVideo: HTMLVideoElement;
  public remoteVideo: HTMLVideoElement;
  public debugCanvas: HTMLCanvasElement;

  public isMyStreamDisplayed = true;
  public isRemoteStreamDisplayed = false;
  public isGridDisplayed = false;

  constructor(
    private videoController: VideoController
  ) {
    this.videoController.myStream$.subscribe(myStream => {
      this.myStream = myStream;
      if (this.myVideo) {
        this.myVideo.srcObject = myStream;
      }
    });
    this.videoController.remoteStream$.subscribe(remoteStream => {
      this.remoteStream = remoteStream;
      if (this.remoteVideo) {
        this.remoteVideo.srcObject = remoteStream;
      }
    });
    this.videoController.showMyStream$.subscribe(showMyStream => this.isMyStreamDisplayed = showMyStream);
    this.videoController.showRemoteStream$.subscribe(showRemoteStream => this.isRemoteStreamDisplayed = showRemoteStream);
    this.videoController.showDebugData$.subscribe(showDebugData => this.isGridDisplayed = showDebugData);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.myVideo = document.querySelector('#own-video') as HTMLVideoElement;
    this.remoteVideo = document.querySelector('#partner-video') as HTMLVideoElement;
    this.debugCanvas = document.querySelector('#debug-canvas') as HTMLCanvasElement;
    this.myVideo.autoplay = true;
    this.remoteVideo.autoplay = true;

    this.videoController.streamElement = this.myVideo;
    this.videoController.debugElement = this.debugCanvas;
  }

  onVideoCloseClicked() {
    this.videoController.setRemoteStream(null);
  }

  ngOnDestroy() {
    this.videoController.streamElement = null;
    this.videoController.debugElement = null;
  }

}
