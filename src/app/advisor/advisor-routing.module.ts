import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorRootComponent } from './containers/advisor-root/advisor-root.component';

const routes: Routes = [
  {
    path: '',
    component: AdvisorRootComponent,
    data: { title: 'Advisor' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvisorRoutingModule {}
