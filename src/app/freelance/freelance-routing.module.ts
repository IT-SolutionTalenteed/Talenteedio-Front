import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreelanceListRootComponent } from './containers/freelance-list-root/freelance-list-root.component';

const routes: Routes = [
    {
      path: '',
      component: FreelanceListRootComponent,
      children: [
        {
          path: '',
          component: FreelanceListRootComponent,
          data: { title: 'Freelance Jobs' },
        },
      ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreelanceRoutingModule { }
