import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularIntlPhoneModule } from 'angular-intl-phone';
import { NgxCaptchaModule } from 'ngx-captcha-ssr';
import { SharedModule } from '../shared/shared.module';
import { JoinUsFromComponent } from './components/join-us-from/join-us-from.component';
import { JoinUsRootComponent } from './container/join-us-root/join-us-root.component';
import { JoinUsRoutingModule } from './join-us-routing.module';
import { JoinUsEffects } from './store/effects/join-us.effects';
import { joinUsReducer } from './store/reducers/join-us.reducers';

@NgModule({
  declarations: [JoinUsFromComponent, JoinUsRootComponent],
  imports: [
    CommonModule,
    JoinUsRoutingModule,
    AngularIntlPhoneModule,
    NgSelectModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('joinUs', joinUsReducer),
    EffectsModule.forFeature([JoinUsEffects]),
  ],
})
export class JoinUsModule {}
