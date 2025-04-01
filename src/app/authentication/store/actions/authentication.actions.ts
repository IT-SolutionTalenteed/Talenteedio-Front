import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { AuthenticationResponse } from '../../types/authentication-response.interface';
import { Credentials } from '../../types/credentials.interface';
import { ResetPasswordPayload } from '../../types/reset-password-payload.interface';

export const logIn = createAction(
  '[Authentication] Log In',
  props<Credentials>()
);

export const logInFail = createAction(
  '[Authentication] Log In Fail',
  props<Error>()
);

export const logInSuccess = createAction(
  '[Authentication] Log In Success',
  props<AuthenticationResponse>()
);

export const logOut = createAction('[Authentification] Log Out');

export const verifySuccess = createAction(
  '[Authentification] Verify Success',
  props<User>()
);

export const verifyFailed = createAction(
  '[Authentification] Verify Failed',
  props<Error>()
);

export const logOutFailed = createAction('[Authentification] Log Out Failed');

export const logOutSuccess = createAction('[Authentification] Log Out Success');

export const refreshTokenSuccess = createAction(
  '[Authentication] Refresh Token Success',
  props<AuthenticationResponse>()
);

export const refreshTokenFailed = createAction(
  '[Authentication] Refresh Token Failed',
  props<Error>()
);

export const signInByAccountValidation = createAction(
  '[Authentication] Sign In By Account Validation'
);

export const clearError = createAction('[EDIT PROFILE] clear error message');

export const resetUptadeStatus = createAction('[EDIT PROFILE] close modal');

export const resetPassword = createAction(
  '[RESET PASSWORD] Reset password',
  props<{ payload: ResetPasswordPayload }>()
);

export const signupUser = createAction(
  '[Authentication] Sign Up User',
  props<{ payload: User }>()
);

export const signupUserFail = createAction(
  '[Authentication] Sign Up User Fail',
  props<Error>()
);

export const signupUserSuccess = createAction(
  '[Authentication] Sign Up User Success',
  props<AuthenticationResponse>()
);

export const reinitPassword = createAction(
  '[Authentication] Reinit Password',
  props<{ payload: string }>()
);

export const reinitPasswordFail = createAction(
  '[Authentication] Reinit Password Fail',
  props<Error>()
);

export const reinitPasswordSuccess = createAction(
  '[Authentication] Reinit Password Success'
);

export const setUser = createAction('[USER] Set User', props<User>());

export const activateAccount = createAction(
  '[AUTHENTICATION] Activate Account'
);

export const accountActivationSuccess = createAction(
  '[Authentication] Account Activation Success',
  props<{ user: User }>()
);

export const accountActivationFail = createAction(
  '[Authentication] Account Activation Fail',
  props<Error>()
);

export const loadValues = createAction('[Authentication] Load Values');

export const loadValuesSuccess = createAction(
  '[Authentication] Load Values Success',
  props<{ payload: Value[] }>()
);

export const loadValuesFail = createAction(
  '[Authentication] Load Values Fail',
  props<Error>()
);
