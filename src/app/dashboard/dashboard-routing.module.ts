import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRootComponent } from './container/dashboard-root/dashboard-root.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardRootComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
