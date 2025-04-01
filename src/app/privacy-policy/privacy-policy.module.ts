import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PrivacyPolicyRootComponent } from './containers/privacy-policy-root/privacy-policy-root.component';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyRouterEffects } from './store/effects/privacy-policy-router.effects';
import { PrivacyPolicyEffects } from './store/effects/privacy-policy.effects';
import { privacyPolicyReducer } from './store/reducers/privacy-policy.reducers';

@NgModule({
  declarations: [PrivacyPolicyRootComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule,
    StoreModule.forFeature('privacyPolicy', privacyPolicyReducer),
    EffectsModule.forFeature([
      PrivacyPolicyRouterEffects,
      PrivacyPolicyEffects,
    ]),
    SharedModule,
  ],
})
export class PrivacyPolicyModule {}
