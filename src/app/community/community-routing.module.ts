import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityRootComponent } from './container/community-root/community-root.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityRootComponent,
    data: { title: 'Join Us' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule {}
