import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinUsRootComponent } from './container/join-us-root/join-us-root.component';

const routes: Routes = [
  {
    path: '',
    component: JoinUsRootComponent,
    data: { title: 'Join Us' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinUsRoutingModule {}
