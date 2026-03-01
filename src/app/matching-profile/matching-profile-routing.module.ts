import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchingProfileRootComponent } from './container/matching-profile-root/matching-profile-root.component';

const routes: Routes = [
  {
    path: '',
    component: MatchingProfileRootComponent,
    data: { title: 'Matching Profile' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchingProfileRoutingModule {}
