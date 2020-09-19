import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { filter, take } from 'rxjs/operators';
import { VideoAnalyzer } from 'src/app/analyzers/video-analyzer';
import { RtcService } from '../../services/rtc.service';
import { User, UserService } from '../../services/user.service';
import { VideoController } from '../../services/video.controller';

@Component({
  selector: 'app-home-office',
  templateUrl: './home-office.component.html',
  styleUrls: ['./home-office.component.scss'],
})
export class HomeOfficeComponent implements OnInit {

  public roomId: string;
  public users: User[] = [];
  public peers: string[] = [];
  public username: string;

  constructor(
    private userService: UserService,
    private loadingService: LoadingController,
    private rtcService: RtcService,
    private toastController: ToastController,
    private router: Router,
    private videoController: VideoController
  ) { }

  public ngOnInit() {
    window['ts'] = this;
    this.initializeAsync();
  }

  public async onUserClicked(user: User) {
    await this.rtcService.requestCall(user);
  }

  public onLogoutClicked() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  public onVideoCloseClicked() {
    this.rtcService.disconnectCall();
  }

  public isConnected(user: User) {
    return this.peers.find(p => user.peerId === p) !== undefined;
  }

  private async initializeAsync() {

    // show loading modal
    const elem = await this.loadingService.create({
      message: 'Wird geladen',
      animated: true,
      backdropDismiss: false,
      showBackdrop: true
    });
    elem.present();

    // load data from server/storage
    const user = this.userService.getUser();
    this.roomId = user.roomId;
    this.username = user.username;
    this.users = await this.userService.getOtherUsers();

    // register for RTC
    if (!this.rtcService.isRegistered()) {
      await this.rtcService.register(this.userService.getUser().peerId);
    }

    // register event handlers
    this.registerEventHandlers();

    this.videoController.requestStreams();
    this.videoController.myStream$.pipe(
      filter(myStream => myStream !== null && myStream !== undefined),
      take(1)
    ).subscribe(() => {
      // wait until stream has been received before initializing the analyzer
      new VideoAnalyzer(this.videoController).initialize();
    });

    this.loadingService.dismiss();

    // connect to all peers
    const promises: Promise<any>[] = [];
    for (const usr of this.users) {
      promises.push(this.rtcService.connectToPeer(usr));
    }
    await Promise.all(promises);
  }

  private registerEventHandlers() {

    this.rtcService.activeConnections$.subscribe(connections => this.peers = connections);

    this.rtcService.onNewPeer$.subscribe(user => {
      if (this.users.find(u => u.peerId === user.peerId) === undefined) {
        this.users.push(user);
      }
    });

    this.rtcService.onCallRequest$.subscribe(async callRequest => {
      const user = this.users.find(u => u.peerId === callRequest.peerId);
      const toast = await this.toastController.create({
        header: 'Incoming Call',
        message: user.username + ' wants to talk to you',
        buttons: [
          {
            text: 'Deny',
            handler: () => {
              callRequest.deny();
              toast.dismiss();
            }
          },
          {
            text: 'Accept',
            handler: () => {
              callRequest.accept();
              toast.dismiss();
            }
          }
        ]
      });
      await toast.present();
    });
  }

}
