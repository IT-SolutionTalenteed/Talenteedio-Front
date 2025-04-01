import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsAndConditionsRootComponent } from './containers/terms-and-conditions-root/terms-and-conditions-root.component';

const routes: Routes = [
  {
    path: '',
    component: TermsAndConditionsRootComponent,
    data: { title: 'Terms' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsAndConditionsRoutingModule {}
