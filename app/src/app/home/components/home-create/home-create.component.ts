import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-create',
  templateUrl: './home-create.component.html',
  styleUrls: ['./home-create.component.scss'],
})
export class HomeCreateComponent implements OnInit {

  public roomId: string;

  constructor(
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.initializeAsync();
  }

  private async initializeAsync() {
    const elem = await this.loadingController.create({
      message: 'Wird geladen',
      animated: true,
      backdropDismiss: false,
      showBackdrop: true
    });
    elem.present();

    this.roomId = await fetch(environment.API_URL + 'create-room', { method: 'POST' }).then(res => res.text());

    this.loadingController.dismiss();
  }

}
