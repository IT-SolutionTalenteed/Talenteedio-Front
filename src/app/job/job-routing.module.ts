import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobRootComponent } from './container/job-root/job-root.component';

const routes: Routes = [
  {
    path: '',
    component: JobRootComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('../job-list/job-list.module').then((m) => m.JobListModule),
      },
      {
        path: 'detail',
        loadChildren: () =>
          import('../job-form/job-form.module').then((m) => m.JobFormModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoutingModule {}
