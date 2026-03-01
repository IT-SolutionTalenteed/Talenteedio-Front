import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularIntlPhoneModule } from 'angular-intl-phone';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardRootComponent } from './container/dashboard-root/dashboard-root.component';
import { CompanyProfileFormComponent } from './components/company-profile-form/company-profile-form.component';
import { MatchingHistoryComponent } from './components/matching-history/matching-history.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardRootComponent,
    CompanyProfileFormComponent,
    MatchingHistoryComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularIntlPhoneModule,
    SharedModule
  ],
  exports: [
    MatchingHistoryComponent
  ]
})
export class DashboardModule { }
