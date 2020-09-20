import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService, User } from './user.service';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
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
  private peer: Peer;
  private activeCall: MediaConnection;
  private connections: Map<string, Peer.DataConnection> = new Map<string, Peer.DataConnection>();

  public activeConnections$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  public onCallRequest$: Subject<CallRequest> = new Subject<CallRequest>();
  public onNewPeer$: Subject<User> = new Subject<User>();
  public onStatusUpdate$: Subject<[ User, UserStatus ]> = new Subject();

  constructor(
    private userService: UserService,
    private videoController: VideoController
  ) {
    this.videoController.remoteStream$.subscribe(remoteStream => {
      if (remoteStream === null || remoteStream === undefined) {
        this.disconnectCall();
      }
    });
  }

  public async register(peerId?: string): Promise<string> {
    if (!peerId) {
      peerId = uuidv4();
    }
    await this.connectToServer(peerId);
    return peerId;
  }

  public isRegistered(): boolean {
    return this.hasServerConnection;
  }

  public async requestCall(user: User): Promise<void> {
    try {
      const myStream = this.videoController.myStream;
      const call = this.peer.call(user.peerId, myStream);
      this.activeCall = call;
      call.on('stream', (remoteStream) => {
        this.videoController.setRemoteStream(remoteStream);
      });
      call.on('close', () => {
        this.disconnectCall();
      });
    } catch (err) {
      console.error('Failed to get local stream', err);
    }
  }

  public async disconnectCall(): Promise<void> {
    if (!this.activeCall) {
      return;
    }
    const peer = this.activeCall.peer;
    this.activeCall.close();
    this.activeCall = null;
    this.videoController.setRemoteStream(null);
    this.sendData(peer, 'hangup', {});
  }

  public deregister() {
    this.disconnectCall();
    for (const conn of this.connections.values()) {
      conn.close();
    }
    this.peer.destroy();
    this.connections.clear();
    this.peer = null;
  }

  public async broadcastStatus(status: UserStatus): Promise<void> {
    for (const peerId of this.connections.keys()) {
      this.sendData(peerId, 'status', UserStatus[status]);
    }
  }

  public async connectToPeer(user: User): Promise<void> {
    if (!this.peer) {
      throw Error('no setup');
    }

    const conn = this.peer.connect(user.peerId);

    // resolves once the peer confirms the establishment of the connection
    await new Promise(resolve => {
      conn.on('open', () => {
        resolve();
      });
    });

    this.saveConnection(conn);

    this.sendData(user.peerId, 'identity', this.userService.getUser().username);
  }

  private async connectToServer(peerId: string): Promise<void> {
    this.peer = new Peer(peerId, {
      host: environment.RTC_URL,
      port: 443,
      path: 'myapp',
      secure: true
    });

    // resolves once the server confirms the establishment of the connection
    await new Promise(resolve => this.peer.on('open', () => {
      this.hasServerConnection = true;
      resolve();
    }));

    // save incoming connections
    this.peer.on('connection', (conn) => {
      this.saveConnection(conn);
    });

    // register for other events
    this.peer.on('disconnected', () => console.log('RTC disconnected'));
    this.peer.on('close', () => console.log('RTC closed'));
    this.peer.on('error', (err) => console.log('RTC error: ' + err));
    this.peer.on('call', (call) => {
      const request: CallRequest = {
        peerId: call.peer,
        accept: async () => {
          const myStream = this.videoController.myStream;
          this.activeCall = call;
          call.answer(myStream);
          call.on('stream', (remoteStream) => {
            this.videoController.setRemoteStream(remoteStream);
          });
          call.on('close', () => {
            this.disconnectCall();
          });
        },
        deny: () => {
          call.close();
        }
      };
      this.onCallRequest$.next(request);
    });
  }

  private saveConnection(conn: DataConnection) {
    this.connections.set(conn.peer, conn);
    this.updateConnectionCount();

    // register for other events
    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.updateConnectionCount();
    });
    conn.on('error', (err) => console.log('Peer error: ' + err));
    conn.on('data', (data) => this.handleData(conn.peer, data));
  }

  private updateConnectionCount() {
    this.activeConnections$.next([...this.connections.keys()]);
  }

  private sendData(peerId: string, actionVerb: string, value: any) {
    this.connections.get(peerId).send({
      action: actionVerb,
      data: value
    });
  }

  private async handleData(peerId: string, data: any) {
    const actionVerb = data.action;
    const value = data.data;

    switch (actionVerb) {
      case 'identity':
        const newUser: User = {
          username: value,
          peerId,
          roomId: this.userService.getUser().roomId
        };
        this.onNewPeer$.next(newUser);
        break;
      case 'hangup':
        this.disconnectCall();
        break;
      case 'status':
        const status = UserStatus[value] as any as UserStatus;
        const user = (await this.userService.getOtherUsers()).find(u => u.peerId === peerId);
        this.onStatusUpdate$.next([ user, status ]);
        break;
      default:
        console.log('data received: ' + data);
    }
  }
}
