import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { TermsAndConditionsRootComponent } from './containers/terms-and-conditions-root/terms-and-conditions-root.component';
import { TermsAndConditionsRouterEffects } from './store/effects/terms-and-conditions-router.effects';
import { TermsAndConditionsEffects } from './store/effects/terms-and-conditions.effects';
import { termsAndConditionsReducer } from './store/reducers/terms-and-conditions.reducers';
import { TermsAndConditionsRoutingModule } from './terms-and-conditions-routing.module';

@NgModule({
  declarations: [TermsAndConditionsRootComponent, TermsAndConditionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    TermsAndConditionsRoutingModule,
    StoreModule.forFeature('termsAndConditions', termsAndConditionsReducer),
    EffectsModule.forFeature([
      TermsAndConditionsEffects,
      TermsAndConditionsRouterEffects,
    ]),
  ],
})
export class TermsAndConditionsModule {}
