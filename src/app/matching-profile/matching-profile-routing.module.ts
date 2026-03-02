import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchingProfileRootComponent } from './container/matching-profile-root/matching-profile-root.component';
import { AppointmentFeedbackPageComponent } from './containers/appointment-feedback-page/appointment-feedback-page.component';

const routes: Routes = [
  {
    path: '',
    component: MatchingProfileRootComponent,
    data: { title: 'Matching Profile' },
  },
  {
    path: 'feedback/:id',
    component: AppointmentFeedbackPageComponent,
    data: { title: 'Feedback Entretien' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchingProfileRoutingModule {}
