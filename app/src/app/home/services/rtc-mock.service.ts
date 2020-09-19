import { Injectable } from '@angular/core';
import { User } from './user.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { VideoController } from './video.controller';
import { UserStatus } from 'src/app/analyzers/user-status';

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
  public onStatusUpdate$: Subject<[ User, UserStatus ]> = new Subject();

  public onCallRequest$: Subject<CallRequest> = new Subject<CallRequest>();
  public onNewPeer$: Subject<User> = new Subject<User>();

  constructor(
    private videoController: VideoController
  ) { }

  public async register(peerId?: string): Promise<string> {
    this.hasServerConnection = true;
    return peerId ?? 'franz';
  }

  public isRegistered(): boolean {
    return this.hasServerConnection;
  }

  public async requestCall(user: User): Promise<void> {
    try {
      const myStream = this.videoController.myStream$;
    } catch (err) {
      console.error('Failed to get local stream', err);
    }
  }

  public async disconnectCall(): Promise<void> {
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
