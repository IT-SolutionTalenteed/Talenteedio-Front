import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AdvisorRoutingModule } from './advisor-routing.module';
import { AdvisorAgendaComponent } from './components/advisor-agenda/advisor-agenda.component';
import { AdvisorEventsComponent } from './components/advisor-events/advisor-events.component';
import { AdvisorNewsComponent } from './components/advisor-news/advisor-news.component';
import { AdvisorPopularJobComponent } from './components/advisor-popular-job/advisor-popular-job.component';
import { WhyBecomeAMemberComponent } from './components/why-become-a-member/why-become-a-member.component';
import { AdvisorRootComponent } from './containers/advisor-root/advisor-root.component';
import { AdvisorService } from './services/advisor.service';
import { AdvisorRouterEffects } from './store/effects/advisor-router.effects';
import { AdvisorEffects } from './store/effects/advisor.effects';
import { advisorReducer } from './store/reducers/advisor.reducers';

@NgModule({
  declarations: [
    AdvisorRootComponent,
    AdvisorNewsComponent,
    AdvisorPopularJobComponent,
    AdvisorEventsComponent,
    AdvisorAgendaComponent,
    WhyBecomeAMemberComponent,
  ],
  providers: [AdvisorService],
  imports: [
    CommonModule,
    AdvisorRoutingModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StoreModule.forFeature('advisor', advisorReducer),
    EffectsModule.forFeature([AdvisorEffects, AdvisorRouterEffects]),
    SharedModule,
  ],
})
export class AdvisorModule {}
