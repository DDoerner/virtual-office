import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { uuid } from 'uuidv4';
import * as Peer from 'peerjs';

@Injectable()
export class RtcService {

  private peer: Peer;

  constructor(
    private authService: AuthService
  ) { }

  register(): string {
    const peerId = uuid();
    this.connect(peerId);
    return peerId;
  }

  private connect(peerId: string) {
    this.peer = new Peer(peerId, {
      host: environment.RTC_URL,
      port: 80,
      path: ''
    });
  }

}
