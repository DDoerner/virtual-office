import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-start',
  templateUrl: './home-start.component.html',
  styleUrls: ['./home-start.component.scss'],
})
export class HomeStartComponent implements OnInit {

  @ViewChild('enterForm') public enterForm: NgForm;

  public roomId: string;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingController,
    private router: Router,
    private route: ActivatedRoute
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

    if (this.authService.isLoggedIn()) {
      await this.router.navigate(['..', 'office'], { relativeTo: this.route });
    }

    this.loadingService.dismiss();
  }

  private async onSubmit(form) {
    await this.router.navigate(['..', 'join'], { relativeTo: this.route, queryParams: { roomId: this.roomId } });
  }
}
