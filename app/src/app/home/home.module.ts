import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePageRoutingModule } from './home-routing.module';
import { HomeStartComponent } from './components/home-start/home-start.component';
import { HomeJoinComponent } from './components/home-join/home-join.component';
import { HomeOfficeComponent } from './components/home-office/home-office.component';
import { HomeCreateComponent } from './components/home-create/home-create.component';

import { RtcService } from './services/rtc.service';
import { UserService } from './services/user.service';
import { SimulationComponent } from '../office-sim/simulation/simulation.component';
import { VideoController } from './services/video.controller';
import { VideoLayerComponent } from './components/video-layer/video-layer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomeStartComponent,
    HomeJoinComponent,
    HomeOfficeComponent,
    HomeCreateComponent,
    SimulationComponent,
    VideoLayerComponent
  ],
  providers: [
    RtcService,
    UserService,
    VideoController
  ]
})
export class HomePageModule {}
