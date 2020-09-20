import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { filter, take } from 'rxjs/operators';
import { UserStatus } from 'src/app/analyzers/user-status';
import { VideoAnalyzer } from 'src/app/analyzers/video-analyzer';
import { SimController } from 'src/app/office-sim/sim-controller';
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
  public user: User;
  public peers: string[] = [];
  public username: string;
  public isInFocusMode = false;

  private simController = new SimController();

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

  public async onFocusToggleClicked() {
    this.isInFocusMode = !this.isInFocusMode;
    if (this.isInFocusMode) {
      await this.rtcService.broadcastStatus(UserStatus.FOCUS);
    }
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
    this.user = this.userService.getUser();
    this.roomId = this.user.roomId;
    this.users = await this.userService.getOtherUsers();

    // update simulation
    const overallStatus = [];
    this.users.map(u => overallStatus.push({ id: u.username, status: UserStatus.WORKING }));
    this.simController.onInitialStatus({
        players: overallStatus
      },
      this.userService.getUser().username
    );

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
    ).subscribe(async () => {
      // wait until stream has been received before initializing the analyzer
      const analyzer = new VideoAnalyzer(this.videoController);
      await analyzer.initialize();
      analyzer.smoothedStatus$.subscribe(status => {
        if (!this.isInFocusMode) {
          this.rtcService.broadcastStatus(status);
        }
      });
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
        this.simController.onPlayerJoined(user.username, UserStatus.WORKING);
      }
    });

    this.rtcService.onStatusUpdate$.subscribe(([ user, status ]) => {
      this.simController.onPlayerStateChanged(user.username, status);
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
