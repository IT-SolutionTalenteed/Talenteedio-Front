import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailRootComponent } from './containers/event-detail-root/event-detail-root.component';
import { EventListRootComponent } from './containers/event-list-root/event-list-root.component';
import { EventRootComponent } from './containers/event-root/event-root.component';
import { EventDetailGuard } from './guards/event-detail.guard';

const routes: Routes = [
  {
    path: '',
    component: EventRootComponent,
    data: { title: 'Event' },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: EventListRootComponent,
        data: { title: 'Event' },
      },
      {
        path: 'detail/:slug',
        component: EventDetailRootComponent,
        data: { title: 'Event', roles: ['admin', 'hr-first-club'] },
        canActivate: [EventDetailGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
