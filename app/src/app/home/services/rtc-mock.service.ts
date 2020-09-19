import { Injectable } from '@angular/core';
import { User } from './user.service';
import { BehaviorSubject, Subject } from 'rxjs';

type CallRequest = {
  peerId: string,
  accept: () => void,
  deny: () => void
};

@Injectable()
export class RtcService {

  private hasServerConnection = false;
  private connections: string[] = [];

  public activeConnections$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public activeStreams$: BehaviorSubject<[MediaStream, MediaStream]> = new BehaviorSubject([null, null]);

  public onCallRequest$: Subject<CallRequest> = new Subject<CallRequest>();
  public onNewPeer$: Subject<User> = new Subject<User>();

  constructor() { }

  public async register(peerId?: string): Promise<string> {
    this.hasServerConnection = true;
    return peerId ?? 'franz';
  }

  public isRegistered(): boolean {
    return this.hasServerConnection;
  }

  public async requestCall(user: User): Promise<void> {
    try {
      const myStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      this.activeStreams$.next([myStream, myStream]);
    } catch (err) {
      console.error('Failed to get local stream', err);
    }
  }

  public async disconnectCall(): Promise<void> {
    this.activeStreams$.next([null, null]);
  }

  public deregister() {
    this.hasServerConnection = false;
  }

  public async connectToPeer(user: User): Promise<void> {
    if (!user.peerId) {
      return;
    }
    await new Promise(resolve => setTimeout(() => {
        this.connections.push(user.peerId);
        this.updateConnectionCount();
        resolve();
      }, 1_500)
    );
  }

  private updateConnectionCount() {
    this.activeConnections$.next(this.connections);
  }
}
