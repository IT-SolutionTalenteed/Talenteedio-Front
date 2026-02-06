import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailRootComponent } from './containers/event-detail-root/event-detail-root.component';
import { EventListRootComponent } from './containers/event-list-root/event-list-root.component';
import { EventCategoryDetailComponent } from './containers/event-category-detail/event-category-detail.component';
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
        path: 'category/:slug',
        component: EventCategoryDetailComponent,
        data: { title: 'Event Category' },
      },
      {
        path: 'detail/:slug',
        component: EventDetailRootComponent,
        data: { title: 'Event' },
        // Guard removed - everyone can access event details without modal
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
