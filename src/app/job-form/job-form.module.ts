import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularIntlPhoneModule } from 'angular-intl-phone';
import { ClipboardModule } from 'ngx-clipboard';
import { SharedModule } from '../shared/shared.module';
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobFormRootComponent } from './containers/job-form-root/job-form-root.component';
import { JobFormRoutingModule } from './job-form-routing.module';
import { JobFormService } from './services/job-form.service';
import { JobFormRouterEffects } from './store/effects/job-form-router.effects';
import { JobFormEffects } from './store/effects/job-form.effects';
import { jobFormReducer } from './store/reducers/job-form.reducers';

@NgModule({
  declarations: [JobFormRootComponent, JobFormComponent],
  imports: [
    CommonModule,
    JobFormRoutingModule,
    FontAwesomeModule,
    SharedModule,
    ClipboardModule,
    NgSelectModule,
    ReactiveFormsModule,
    AngularIntlPhoneModule,
    StoreModule.forFeature('jobForm', jobFormReducer),
    EffectsModule.forFeature([JobFormEffects, JobFormRouterEffects]),
  ],
  providers: [JobFormService],
})
export class JobFormModule {}
