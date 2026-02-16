import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularIntlPhoneModule } from 'angular-intl-phone';
import { NgxCaptchaModule } from 'ngx-captcha-ssr';
import { SharedModule } from '../shared/shared.module';
import { MatchingProfileRoutingModule } from './matching-profile-routing.module';
import { MatchingProfileRootComponent } from './container/matching-profile-root/matching-profile-root.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { CompanyMatchesComponent } from './components/company-matches/company-matches.component';
import { AppointmentSchedulerComponent } from './components/appointment-scheduler/appointment-scheduler.component';
import { AuthModalInlineComponent } from './components/auth-modal-inline/auth-modal-inline.component';
import { MatchingProfileService } from './services/matching-profile.service';

@NgModule({
  declarations: [
    MatchingProfileRootComponent,
    ProfileFormComponent,
    CompanyMatchesComponent,
    AppointmentSchedulerComponent,
    AuthModalInlineComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularIntlPhoneModule,
    NgxCaptchaModule,
    MatchingProfileRoutingModule,
    SharedModule,
  ],
  providers: [MatchingProfileService],
})
export class MatchingProfileModule {}
