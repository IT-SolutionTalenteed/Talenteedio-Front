import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BlogModule } from '../blog/blog.module';
import { SharedModule } from '../shared/shared.module';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityAgendaComponent } from './components/community-agenda/community-agenda.component';
import { CommunityEventsComponent } from './components/community-events/community-events.component';
import { CommunityPartnerComponent } from './components/community-partner/community-partner.component';
import { PublicCommunityComponent } from './components/public-community/public-community.component';
import { CommunityRootComponent } from './container/community-root/community-root.component';
import { PrivateCommunityRootComponent } from './container/private-community-root/private-community-root.component';
import { PublicCommunityRootComponent } from './container/public-community-root/public-community-root.component';
import { CommunityService } from './services/community.service';
import { CommunityRouterEffects } from './store/effects/community-router.effects';
import { CommunityEffects } from './store/effects/community.effects';
import { communityReducer } from './store/reducers/community.reducers';

@NgModule({
  declarations: [
    PublicCommunityComponent,
    CommunityRootComponent,
    CommunityPartnerComponent,
    PrivateCommunityRootComponent,
    PublicCommunityRootComponent,
    CommunityEventsComponent,
    CommunityAgendaComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommunityRoutingModule,
    StoreModule.forFeature('community', communityReducer),
    EffectsModule.forFeature([CommunityEffects, CommunityRouterEffects]),
    SharedModule,
    BlogModule,
  ],
  providers: [CommunityService],
})
export class CommunityModule {}
