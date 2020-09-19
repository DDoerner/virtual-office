import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RtcService {

  private peer;

  constructor(
    private userService: UserService
  ) { }

  public register(): string {
    const peerId = uuidv4();
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
