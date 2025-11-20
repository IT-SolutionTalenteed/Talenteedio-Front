import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachingEmploiComponent } from './coaching-emploi.component';
import { ConsultantsComponent } from './containers/consultants/consultants.component';
import { ServicesComponent } from './containers/services/services.component';
import { BookingComponent } from './containers/booking/booking.component';
import { SuccessComponent } from './containers/success/success.component';

const routes: Routes = [
  {
    path: '',
    component: CoachingEmploiComponent,
  },
  {
    path: 'consultants',
    component: ConsultantsComponent,
  },
  {
    path: 'services/:consultant',
    component: ServicesComponent,
  },
  {
    path: 'booking/:consultant/:service',
    component: BookingComponent,
  },
  {
    path: 'success',
    component: SuccessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachingEmploiRoutingModule {}
