import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { JobListModule } from '../job-list/job-list.module';
import { FreelanceItemComponent } from './components/freelance-item/freelance-item.component';
import { FreelanceListBoxFilterComponent } from './components/freelance-list-box-filter/freelance-list-box-filter.component';
import { FreelanceListComponent } from './components/freelance-list/freelance-list.component';
import { FreelanceSortComponent } from './components/freelance-sort/freelance-sort.component';
import { FreelanceListRootComponent } from './containers/freelance-list-root/freelance-list-root.component';
import { FreelanceRoutingModule } from './freelance-routing.module';
import { FreelanceListService } from './services/freelance-list.service';
import { FreelanceListRouterEffects } from './store/effects/freelance-list-router.effects';
import { FreelanceListEffects } from './store/effects/freelance-list.effects';
import { freelanceListReducer } from './store/reducers/freelance-list.reducers';

@NgModule({
  declarations: [
    FreelanceListRootComponent,
    FreelanceListComponent,
    FreelanceItemComponent,
    FreelanceListBoxFilterComponent,
    FreelanceSortComponent,
  ],
  imports: [
    CommonModule,
    FreelanceRoutingModule,
    FontAwesomeModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    JobListModule,
    StoreModule.forFeature('freelanceList', freelanceListReducer),
    EffectsModule.forFeature([FreelanceListEffects, FreelanceListRouterEffects]),
  ],
  providers: [
    {
      provide: FreelanceListService,
      useClass: FreelanceListService,
    },
  ],
})
export class FreelanceModule {}
