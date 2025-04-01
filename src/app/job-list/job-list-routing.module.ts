import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobListRootComponent } from './containers/job-list-root/job-list-root.component';

const routes: Routes = [
    {
      path: '',
      component: JobListRootComponent,
      children: [
        {
          path: '',
          component: JobListRootComponent,
          data: { title: 'Jobs' },
        },
      ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobListRoutingModule { }
