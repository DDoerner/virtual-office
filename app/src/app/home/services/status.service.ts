import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { debounce, distinct } from 'rxjs/operators';

@Injectable()
export class StatusService {

  public videoStream: MediaStream;
  public audioStream: MediaStream;
  public currentStatus$: BehaviorSubject<UserStatus> = new BehaviorSubject(UserStatus.UNKNOWN);
  public smoothedStatus$: BehaviorSubject<UserStatus> = new BehaviorSubject(UserStatus.UNKNOWN);

  constructor() {
    this.currentStatus$.pipe(
      distinct(),
      debounce(() => timer(2000))
    ).subscribe(this.smoothedStatus$);
  }

  public async requestStreams() {
    this.videoStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    this.audioStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
  }

  public async startAnalyzers() {
    if (!this.videoStream) {
      await this.requestStreams();
    }
    // create and start analyzers
  }
}

export enum UserStatus {
  UNKNOWN,
  WORKING,
  AWAY,
  EATING,
  PHONE,
  TALK,
  OFFLINE
}
