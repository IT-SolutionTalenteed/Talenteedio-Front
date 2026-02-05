import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { DidYouKnowComponent } from './components/did-you-know/did-you-know.component';
import { JobItemComponent } from './components/job-item/job-item.component';
import { JobListBoxFilterComponent } from './components/job-list-box-filter/job-list-box-filter.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobSortComponent } from './components/job-sort/job-sort.component';
import { CardCompanyComponent } from './components/top-company/card-company/card-company.component';
import { TopCompanyComponent } from './components/top-company/top-company.component';
import { JobListRootComponent } from './containers/job-list-root/job-list-root.component';
import { JobListRoutingModule } from './job-list-routing.module';
import { JobListService } from './services/job-list.service';
import { JobListRouterEffects } from './store/effects/job-list-router.effects';
import { JobListEffects } from './store/effects/job-list.effects';
import { jobListReducer } from './store/reducers/job-list.reducers';

@NgModule({
  declarations: [
    JobListRootComponent,
    JobListComponent,
    JobItemComponent,
    JobListBoxFilterComponent,
    JobSortComponent,
    TopCompanyComponent,
    CardCompanyComponent,
    DidYouKnowComponent,
  ],
  exports: [
    TopCompanyComponent,
    CardCompanyComponent,
    DidYouKnowComponent,
  ],
  imports: [
    CommonModule,
    JobListRoutingModule,
    FontAwesomeModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    FavoriteModule,
    StoreModule.forFeature('jobList', jobListReducer),
    EffectsModule.forFeature([JobListEffects, JobListRouterEffects]),
  ],
  providers: [
    {
      provide: JobListService,
      useClass: JobListService,
    },
  ],
})
export class JobListModule {}
