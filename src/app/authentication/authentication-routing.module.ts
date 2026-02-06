import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountValidationFormRootComponent } from './containers/account-validation-form-root/account-validation-form-root.component';
import { AuthenticationRootComponent } from './containers/authentication-root/authentication-root.component';
import { ReinitPasswordRootComponent } from './containers/reinit-password-root/reinit-password-root.component';
import { SignInRootComponent } from './containers/sign-in-root/sign-in-root.component';
import { SignUpRootComponent } from './containers/sign-up-root/sign-up-root.component';
import { SignUpChoiceRootComponent } from './containers/sign-up-choice-root/sign-up-choice-root.component';
import { CompanyRegisterRootComponent } from './containers/company-register-root/company-register-root.component';
import { ConsultantRegisterRootComponent } from './containers/consultant-register-root/consultant-register-root.component';
import { CompanyPlanRootComponent } from './containers/company-plan-root/company-plan-root.component';
import { CompanyContactRootComponent } from './containers/company-contact-root/company-contact-root.component';
import { CompanyRegistrationSuccessComponent } from './containers/company-registration-success/company-registration-success.component';
import { AccountValidationGuard } from './guards/account-validation.guard';
import { OnlySingleSignInGuard } from './guards/only-single-sign-in.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationRootComponent,
    children: [
      { path: '', redirectTo: 'sign-up-choice', pathMatch: 'full' },
      {
        path: 'sign-up-choice',
        component: SignUpChoiceRootComponent,
        canActivate: [OnlySingleSignInGuard],
        data: { title: 'Choisir un type de compte' },
      },
      {
        path: 'sign-in',
        component: SignInRootComponent,
        canActivate: [OnlySingleSignInGuard],
        data: { title: 'Authentication' },
      },
      {
        path: 'sign-up',
        component: SignUpRootComponent,
        canActivate: [OnlySingleSignInGuard],
        data: { title: 'Registration' },
      },
      {
        path: 'company-register',
        component: CompanyRegisterRootComponent,
        canActivate: [OnlySingleSignInGuard],
        data: { title: 'Créer un compte Société' },
      },
      {
        path: 'consultant-register',
        component: ConsultantRegisterRootComponent,
        canActivate: [OnlySingleSignInGuard],
        data: { title: 'Créer un compte Consultant' },
      },
      {
        path: 'company-plan',
        component: CompanyPlanRootComponent,
        canActivate: [OnlySingleSignInGuard],
        data: { title: 'Choisir un plan' },
      },
      {
        path: 'company-contact',
        component: CompanyContactRootComponent,
        canActivate: [OnlySingleSignInGuard],
        data: { title: 'Inscription entreprise' },
      },
      {
        path: 'company-registration-success',
        component: CompanyRegistrationSuccessComponent,
        data: { title: 'Inscription réussie' },
      },
      {
        path: 'reinit-password',
        component: ReinitPasswordRootComponent,
        data: { title: 'Password reset' },
      },
      {
        path: 'account-validation/:token',
        canActivate: [AccountValidationGuard],
        component: AccountValidationFormRootComponent,
        data: { title: 'Account activation' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
