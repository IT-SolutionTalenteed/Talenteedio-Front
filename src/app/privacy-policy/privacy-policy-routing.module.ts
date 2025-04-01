import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyRootComponent } from './containers/privacy-policy-root/privacy-policy-root.component';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyRootComponent,
    data: {
      title: 'Privacy Policy',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyPolicyRoutingModule {}
