import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewDetailRootComponent } from './containers/interview-detail-root/interview-detail-root.component';
import { InterviewListRootComponent } from './containers/interview-list-root/interview-list-root.component';
import { InterviewRootComponent } from './containers/interview-root/interview-root.component';

const routes: Routes = [
  {
    path: '',
    component: InterviewRootComponent,
    data: { title: 'Interview' },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: InterviewListRootComponent,
        data: { title: 'Interview' },
      },
      {
        path: 'detail/:interviewId',
        component: InterviewDetailRootComponent,
        data: { title: 'Interview' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewRoutingModule {}
