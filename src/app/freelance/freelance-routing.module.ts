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
    {
      path: 'detail',
      loadChildren: () =>
        import('../job-form/job-form.module').then((m) => m.JobFormModule),
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreelanceRoutingModule { }
