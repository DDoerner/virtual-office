import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { RtcService } from '../../services/rtc.service';

@Component({
  selector: 'app-home-join',
  templateUrl: './home-join.component.html',
  styleUrls: ['./home-join.component.scss'],
})
export class HomeJoinComponent implements OnInit {

  public roomId: string;
  public username: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rtcService: RtcService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.queryParamMap.get('roomId');
    if (!this.roomId) {
      this.router.navigate(['..', 'start'], { relativeTo: this.route });
    }
  }

  private async onSubmit(form) {
    const peerId = this.rtcService.register();
    const user: User = {
      peerId,
      username: this.username,
      roomId: this.roomId
    };
    await this.userService.register(user);

    await this.router.navigate(['..', 'office'], { relativeTo: this.route });
  }
}
