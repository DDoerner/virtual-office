import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService, User } from './user.service';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Subject } from 'rxjs';

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
  public activeStreams$: BehaviorSubject<[MediaStream, MediaStream]> = new BehaviorSubject([null, null]);

  public onCallRequest$: Subject<CallRequest> = new Subject<CallRequest>();
  public onNewPeer$: Subject<User> = new Subject<User>();

  constructor(
    private userService: UserService
  ) { }

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
      const myStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      const call = this.peer.call(user.peerId, myStream);
      this.activeCall = call;
      call.on('stream', (remoteStream) => {
        this.activeStreams$.next([myStream, remoteStream]);
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
    const streams = this.activeStreams$.value;
    if (streams) {
      const [ myStream, remoteStream ] = streams;
      myStream?.getTracks().forEach(t => t.stop());
      remoteStream?.getTracks().forEach(t => t.stop());
      this.activeStreams$.next([null, null]);
    }
    this.activeCall = null;
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
          const myStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
          this.activeCall = call;
          call.answer(myStream);
          call.on('stream', (remoteStream) => {
            this.activeStreams$.next([myStream, remoteStream]);
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

  private handleData(peerId: string, data: any) {
    const actionVerb = data.action;
    const value = data.data;

    alert(actionVerb + ' - ' + value);

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
      default:
        console.log('data received: ' + data);
    }
  }
}
