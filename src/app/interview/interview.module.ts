import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { InterviewItemComponent } from './components/interview-item/interview-item.component';
import { InterviewListFilterBoxComponent } from './components/interview-list-filter-box/interview-list-filter-box.component';
import { InterviewListComponent } from './components/interview-list/interview-list.component';
import { InterviewListRootComponent } from './containers/interview-list-root/interview-list-root.component';
import { InterviewRoutingModule } from './interview-routing.module';
import { InterviewRouterEffects } from './store/effects/interview-router.effects';
import { InterviewEffects } from './store/effects/interview.effects';
import { interviewReducer } from './store/reducers/interview.reducer';
import { InterviewRootComponent } from './containers/interview-root/interview-root.component';
import { InterviewDetailRootComponent } from './containers/interview-detail-root/interview-detail-root.component';
import { InterviewDetailComponent } from './components/interview-detail/interview-detail.component';

@NgModule({
  declarations: [
    InterviewListComponent,
    InterviewListRootComponent,
    InterviewItemComponent,
    InterviewListFilterBoxComponent,
    InterviewRootComponent,
    InterviewDetailRootComponent,
    InterviewDetailComponent,
  ],
  imports: [
    CommonModule,
    InterviewRoutingModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    StoreModule.forFeature('interview', interviewReducer),
    EffectsModule.forFeature([InterviewRouterEffects, InterviewEffects]),
  ],
})
export class InterviewModule {}
