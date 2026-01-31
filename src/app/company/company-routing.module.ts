import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './containers/company-list/company-list.component';
import { CompanyDetailComponent } from './containers/company-detail/company-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyListComponent,
    data: { title: 'Companies' }
  },
  {
    path: ':slug',
    component: CompanyDetailComponent,
    data: { title: 'Company Detail' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
