import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobFormRootComponent } from './containers/job-form-root/job-form-root.component';

const routes: Routes = [
    {
        path: ':jobId',
        component: JobFormRootComponent,
        data: { title: 'Job' }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobFormRoutingModule { }
