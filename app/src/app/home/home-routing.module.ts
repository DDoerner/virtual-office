import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCreateComponent } from './components/home-create/home-create.component';
import { HomeJoinComponent } from './components/home-join/home-join.component';
import { HomeOfficeComponent } from './components/home-office/home-office.component';
import { HomeStartComponent } from './components/home-start/home-start.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start'
  },
  {
    path: 'start',
    component: HomeStartComponent
  },
  {
    path: 'join',
    component: HomeJoinComponent
  },
  {
    path: 'create',
    component: HomeCreateComponent
  },
  {
    path: 'office',
    component: HomeOfficeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
