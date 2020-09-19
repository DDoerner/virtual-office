import { HttpClient } from '@angular/common/http';
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
    private loadingController: LoadingController,
    private httpClient: HttpClient
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

    this.roomId = await this.httpClient.post<string>(environment.API_URL + 'create-room', {}).toPromise();

    this.loadingController.dismiss();
  }

}
