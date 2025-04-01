import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountValidationFormRootComponent } from './containers/account-validation-form-root/account-validation-form-root.component';
import { AuthenticationRootComponent } from './containers/authentication-root/authentication-root.component';
import { ReinitPasswordRootComponent } from './containers/reinit-password-root/reinit-password-root.component';
import { SignInRootComponent } from './containers/sign-in-root/sign-in-root.component';
import { SignUpRootComponent } from './containers/sign-up-root/sign-up-root.component';
import { AccountValidationGuard } from './guards/account-validation.guard';
import { OnlySingleSignInGuard } from './guards/only-single-sign-in.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationRootComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
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
