import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class VideoController {

    public streamElement: HTMLVideoElement;
    public debugElement: HTMLCanvasElement;

    public myStream$: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public showMyStream$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public showDebugData$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public showRemoteStream$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public get myStream() {
        return this.myStream$.value;
    }
    public get remoteStream() {
        return this.remoteStream$.value;
    }

    public async requestStreams() {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        this.myStream$.next(stream);
    }

    public setRemoteStream(remoteStream?: MediaStream) {
        if (this.remoteStream) {
            remoteStream?.getTracks().forEach(t => t.stop());
        }
        this.remoteStream$.next(remoteStream);
        this.showRemoteStream$.next(remoteStream !== null && remoteStream !== undefined);
    }

}