import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { InterviewComponent } from './components/interview/interview.component';
import { NewItemComponent } from './components/new-item/new-item.component';
import { NewsComponent } from './components/news/news.component';
import { ReplayItemComponent } from './components/replay-item/replay-item.component';
import { ReplayComponent } from './components/replay/replay.component';
import { HrVoiceRootComponent } from './containers/hr-voice-root/hr-voice-root.component';
import { HrVoiceRoutingModule } from './hr-voice-routing.module';
import { HrVoiceRouterEffects } from './store/effects/hr-voice-router.effects';
import { HrVoiceEffects } from './store/effects/hr-voice.effects';
import { hrVoiceReducer } from './store/reducers/hr-voice.reducers';

@NgModule({
  declarations: [
    HrVoiceRootComponent,
    InterviewComponent,
    ReplayComponent,
    NewsComponent,
    ReplayItemComponent,
    NewItemComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    StoreModule.forFeature('hrVoice', hrVoiceReducer),
    EffectsModule.forFeature([HrVoiceEffects, HrVoiceRouterEffects]),
    HrVoiceRoutingModule,
    SharedModule,
  ],
})
export class HrVoiceModule {}
