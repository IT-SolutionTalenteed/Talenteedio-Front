import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyListComponent } from './containers/company-list/company-list.component';
import { CompanyDetailComponent } from './containers/company-detail/company-detail.component';
import { CompanyCardComponent } from './components/company-card/company-card.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompanyService } from './services/company.service';

@NgModule({
  declarations: [
    CompanyListComponent,
    CompanyDetailComponent,
    CompanyCardComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [
    CompanyService
  ]
})
export class CompanyModule { }
