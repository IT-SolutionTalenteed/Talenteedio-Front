import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { EventListBoxFilterComponent } from './components/event-list-box-filter/event-list-box-filter.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventCategoryDetailComponent } from './containers/event-category-detail/event-category-detail.component';
import { EventDetailRootComponent } from './containers/event-detail-root/event-detail-root.component';
import { EventListRootComponent } from './containers/event-list-root/event-list-root.component';
import { EventRootComponent } from './containers/event-root/event-root.component';
import { EventRoutingModule } from './event-routing.module';
import { EventDetailService } from './guards/event-detail.guard';
import { EventService } from './services/event.service';
import { EventRouterEffects } from './store/effects/event-router.effects';
import { EventEffects } from './store/effects/event.effects';
import { eventReducer } from './store/reducers/event.reducers';

@NgModule({
  declarations: [
    EventRootComponent,
    EventListRootComponent,
    EventCategoryDetailComponent,
    EventDetailRootComponent,
    EventListBoxFilterComponent,
    EventListComponent,
    EventItemComponent,
    EventDetailComponent,
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    StoreModule.forFeature('event', eventReducer),
    EffectsModule.forFeature([EventEffects, EventRouterEffects]),
  ],
  providers: [EventService, EventDetailService],
})
export class EventModule {}
