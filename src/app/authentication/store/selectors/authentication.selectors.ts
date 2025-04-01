import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getRouterState } from 'src/app/routeur/store/selectors/router.selectors';
import { User } from 'src/app/shared/models/user.interface';
import { AuthenticationState } from '../reducers/authentication.reducers';

export const getAuthenticationState =
  createFeatureSelector<AuthenticationState>('auth');

export const getLoggedUser = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state?.user
);

export const getRefreshToken = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state?.refreshToken
);

export const getUserLoggedIn = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state?.userLoggedIn
);

export const getIsUserTalent = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => !!state?.user?.talent
);

export const getUserLoggingIn = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.userLoggingIn
);

export const getEmailError = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.emailError
);

export const getEmailErrorMessage = createSelector(
  getEmailError,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (emailError: any) => emailError?.error?.msg
);

export const getReinitPasswordErrorMessage = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) =>
    state?.reinitPasswordError?.message ?? 'Une erreur vient de se produire'
);

export const getUserRole = createSelector(
  getLoggedUser,
  (user: User) => user && user.roles && user.roles[0]
);
export const getUserRoles = createSelector(
  getLoggedUser,
  (user: User) => user && user.roles
);

export const getLoginError = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state?.loginError
);

export const getLoginErrorMessage = createSelector(
  getLoginError,
  (loginError: Error) => loginError?.message ?? ''
);

export const getUserSaving = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.userSaving
);

export const getResetPasswordToken = createSelector(
  getRouterState,
  (router) => router.state.params['token']
);

export const getAuthenticationLoading = createSelector(
  getUserSaving,
  getUserLoggingIn,
  (saving, loggingIn) => saving || loggingIn
);

export const getSignUpError = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.signUpError
);

export const getUserSaved = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.userSaved
);

export const getReinitPasswordLoading = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.reinitPasswordLoading
);

export const getAccountActivationToken = createSelector(
  getRouterState,
  (router) => router.state.params['token']
);

export const getAccessToken = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.token
);

export const getAccountActivationLoading = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.accountActivationLoading
);

export const getAccountActivationLoaded = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.accountActivationLoaded
);

export const getVerifying = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.verifying
);
export const getVerified = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.verified
);

export const getValues = createSelector(
  getAuthenticationState,
  (state: AuthenticationState) => state.values
);
