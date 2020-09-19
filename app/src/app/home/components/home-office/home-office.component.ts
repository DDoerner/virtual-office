import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-home-office',
  templateUrl: './home-office.component.html',
  styleUrls: ['./home-office.component.scss'],
})
export class HomeOfficeComponent implements OnInit {

  public roomId: string;
  public users: User[];

  constructor(
    private userService: UserService,
    private loadingService: LoadingController
  ) { }

  public ngOnInit() {
    this.initializeAsync();
  }

  private async initializeAsync() {
    const elem = await this.loadingService.create({
      message: 'Wird geladen',
      animated: true,
      backdropDismiss: false,
      showBackdrop: true
    });
    elem.present();

    this.roomId = this.userService.getUser().roomId;
    this.users = await this.userService.getOtherUsers();

    this.loadingService.dismiss();
  }

  public onLogoutClicked() {
    this.userService.logout();
  }
}
