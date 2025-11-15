import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { AngularIntlPhoneModule } from 'angular-intl-phone';
import { NgxCaptchaModule } from 'ngx-captcha-ssr';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AccountValidationErrorComponent } from './components/account-validation-error/account-validation-error.component';
import { AuthenticationLeftComponent } from './components/authentication-left/authentication-left.component';
import { ReinitPasswordComponent } from './components/reinit-password/reinit-password.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AccountValidationFormRootComponent } from './containers/account-validation-form-root/account-validation-form-root.component';
import { AuthenticationRootComponent } from './containers/authentication-root/authentication-root.component';
import { ReinitPasswordRootComponent } from './containers/reinit-password-root/reinit-password-root.component';
import { SignInRootComponent } from './containers/sign-in-root/sign-in-root.component';
import { SignUpRootComponent } from './containers/sign-up-root/sign-up-root.component';
import { AccountValidationService } from './guards/account-validation.guard';
import { OnlySingleSignInService } from './guards/only-single-sign-in.guard';
import { AuthenticationRouterEffects } from './store/effects/authentication-route.effects';
import { AuthenticationEffects } from './store/effects/authentication.effects';
import { SignUpChoiceRootComponent } from './containers/sign-up-choice-root/sign-up-choice-root.component';
import { CompanyRegisterRootComponent } from './containers/company-register-root/company-register-root.component';
import { CompanyPlanRootComponent } from './containers/company-plan-root/company-plan-root.component';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      AuthenticationEffects,
      AuthenticationRouterEffects,
    ]),
    SharedModule,
    NgSelectModule,
    NgxCaptchaModule,
    FontAwesomeModule,
    AngularIntlPhoneModule,
  ],
  declarations: [
    AuthenticationRootComponent,
    AccountValidationErrorComponent,
    AccountValidationFormRootComponent,
    SignInComponent,
    SignUpComponent,
    SignInRootComponent,
    SignUpRootComponent,
    ReinitPasswordComponent,
    ReinitPasswordRootComponent,
    AuthenticationLeftComponent,
    SignUpChoiceRootComponent,
    CompanyRegisterRootComponent,
    CompanyPlanRootComponent,
  ],
  providers: [OnlySingleSignInService, AccountValidationService],
})
export class AuthenticationModule {}
