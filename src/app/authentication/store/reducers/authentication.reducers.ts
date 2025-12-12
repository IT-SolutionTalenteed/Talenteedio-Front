import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { HttpException } from 'src/app/shared/types/http-exception.interface';
import { AuthenticationResponse } from '../../types/authentication-response.interface';
import {
  accountActivationFail,
  accountActivationSuccess,
  activateAccount,
  clearError,
  googleSignIn,
  googleSignInFail,
  googleSignInSuccess,
  linkGoogleAccount,
  linkGoogleAccountFail,
  linkGoogleAccountSuccess,
  loadValues,
  loadValuesFail,
  loadValuesSuccess,
  logIn,
  logInFail,
  logInSuccess,
  logOut,
  logOutFailed,
  logOutSuccess,
  refreshTokenFailed,
  refreshTokenSuccess,
  reinitPassword,
  reinitPasswordFail,
  reinitPasswordSuccess,
  setUser,
  signupUser,
  signupUserFail,
  signupUserSuccess,
  verifyFailed,
  verifySuccess,
} from '../actions/authentication.actions';

export interface AuthenticationState {
  user: User;
  userLoggedIn: boolean;
  userLoggingIn: boolean;
  token: string;
  refreshToken: string;
  refreshTokenError: Error;
  emailError: Error;
  reinitPasswordError: Error;
  loginError: Error;
  editProfileError: HttpException;
  userSaving: boolean;
  signUpError: Error;
  userSaved: boolean;
  reinitPasswordLoading: boolean;
  reinitPasswordLoaded: boolean;
  logOutLoading: boolean;
  accountActivationLoading: boolean;
  accountActivationLoaded: boolean;
  accountActivationError: Error;
  verifying: boolean;
  verified: boolean;
  values: Value[];
  valuesLoading: boolean;
  valuesLoaded: boolean;
  googleSignInLoading: boolean;
  googleSignInError: Error;
  linkGoogleAccountLoading: boolean;
  linkGoogleAccountError: Error;
}

const initialState: AuthenticationState = {
  user: undefined,
  userLoggedIn: false,
  userLoggingIn: false,
  token: undefined,
  refreshToken: undefined,
  refreshTokenError: undefined,
  emailError: undefined,
  reinitPasswordError: undefined,
  loginError: undefined,
  editProfileError: undefined,
  signUpError: undefined,
  userSaving: false,
  userSaved: false,
  reinitPasswordLoading: false,
  reinitPasswordLoaded: false,
  logOutLoading: false,
  accountActivationLoading: false,
  accountActivationLoaded: false,
  accountActivationError: undefined,
  verifying: true,
  verified: false,
  values: [],
  valuesLoading: false,
  valuesLoaded: false,
  googleSignInLoading: false,
  googleSignInError: undefined,
  linkGoogleAccountLoading: false,
  linkGoogleAccountError: undefined,
};

const logInReducer = (state: AuthenticationState): AuthenticationState => ({
  ...state,
  userLoggedIn: false,
  userLoggingIn: true,
});

const signupUserReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  userSaved: false,
  userSaving: true,
});

const activateAccountReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  accountActivationLoading: true,
  accountActivationLoaded: false,
});

const reinitPasswordReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  reinitPasswordLoading: true,
  reinitPasswordLoaded: false,
});

const reinitPasswordFailReducer = (
  state: AuthenticationState,
  props: Error
): AuthenticationState => ({
  ...state,
  reinitPasswordLoading: false,
  reinitPasswordLoaded: false,
  emailError: props,
});

const reinitPasswordSuccessReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  reinitPasswordLoading: false,
  reinitPasswordLoaded: true,
});

const logInFailReducer = (
  state: AuthenticationState,
  props: Error
): AuthenticationState => ({
  ...state,
  userLoggedIn: false,
  userLoggingIn: false,
  emailError: props,
});

const signupUserFailReducer = (
  state: AuthenticationState,
  props: Error
): AuthenticationState => ({
  ...state,
  userSaved: false,
  userSaving: false,
  signUpError: props,
});

const accountActivationFailReducer = (
  state: AuthenticationState,
  props: Error
): AuthenticationState => ({
  ...state,
  accountActivationLoading: false,
  accountActivationLoaded: false,
  accountActivationError: props,
});

const logInSuccessReducer = (
  state: AuthenticationState,
  props: AuthenticationResponse
): AuthenticationState => ({
  ...state,
  userLoggedIn: true,
  userLoggingIn: false,
  user: props.user,
  token: props.accessToken,
  refreshToken: props.refreshToken,
  refreshTokenError: undefined,
});

const signupUserSuccessReducer = (
  state: AuthenticationState,
  props: AuthenticationResponse
): AuthenticationState => ({
  ...state,
  userSaved: true,
  userSaving: false,
  user: props.user,
  token: props.accessToken,
  refreshToken: props.refreshToken,
  refreshTokenError: undefined,
});

const accountActivationSuccessReducer = (
  state: AuthenticationState,
  props: { user: User }
): AuthenticationState => ({
  ...state,
  accountActivationLoading: false,
  accountActivationLoaded: true,
  user: props.user,
  accountActivationError: undefined,
});

const refreshTokenSuccessReducer = (
  state: AuthenticationState,
  props: AuthenticationResponse
): AuthenticationState => ({
  ...state,
  userLoggedIn: true,
  userLoggingIn: false,
  user: props.user,
  token: props.accessToken,
  refreshToken: props.refreshToken,
  refreshTokenError: undefined,
});

const refreshTokenFailedReducer = (
  state: AuthenticationState,
  props: Error
): AuthenticationState => ({
  ...state,
  user: undefined,
  userLoggedIn: false,
  token: undefined,
  refreshToken: undefined,
  refreshTokenError: props,
});

const logOutReducer = (state: AuthenticationState): AuthenticationState => ({
  ...state,
  logOutLoading: true,
});

const logOutSuccessReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  user: undefined,
  userLoggedIn: false,
  token: undefined,
  refreshToken: undefined,
  refreshTokenError: undefined,
  logOutLoading: false,
});

const logOutFailedReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  logOutLoading: true,
});

const setUserReducer = (
  state: AuthenticationState,
  props: User
): AuthenticationState => ({
  ...state,
  user: props,
});

const verifyFailedReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  user: undefined,
  refreshToken: undefined,
  token: undefined,
  userLoggedIn: false,
  verifying: false,
  verified: true,
});

const verifySuccessReducer = (
  state: AuthenticationState,
  props: User
): AuthenticationState => ({
  ...state,
  userLoggedIn: true,
  verifying: false,
  verified: true,
  user: { ...state.user, ...props },
});

const loadValuesReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  valuesLoading: true,
  valuesLoaded: false,
});

const loadValuesSuccessReducer = (
  state: AuthenticationState,
  props: { payload: Value[] }
): AuthenticationState => ({
  ...state,
  valuesLoading: false,
  valuesLoaded: true,
  values: props.payload,
});

const loadValuesFailReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  valuesLoading: false,
  valuesLoaded: false,
});

const clearErrorReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  emailError: undefined,
  loginError: undefined,
  signUpError: undefined,
  reinitPasswordError: undefined,
  accountActivationError: undefined,
  googleSignInError: undefined,
  linkGoogleAccountError: undefined,
});

const googleSignInReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  userLoggedIn: false,
  userLoggingIn: true,
  googleSignInLoading: true,
  googleSignInError: undefined,
});

const googleSignInSuccessReducer = (
  state: AuthenticationState,
  props: AuthenticationResponse
): AuthenticationState => ({
  ...state,
  userLoggedIn: true,
  userLoggingIn: false,
  googleSignInLoading: false,
  user: props.user,
  token: props.accessToken,
  refreshToken: props.refreshToken,
  googleSignInError: undefined,
});

const googleSignInFailReducer = (
  state: AuthenticationState,
  props: Error
): AuthenticationState => ({
  ...state,
  userLoggedIn: false,
  userLoggingIn: false,
  googleSignInLoading: false,
  googleSignInError: props,
});

const linkGoogleAccountReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  linkGoogleAccountLoading: true,
  linkGoogleAccountError: undefined,
});

const linkGoogleAccountSuccessReducer = (
  state: AuthenticationState
): AuthenticationState => ({
  ...state,
  linkGoogleAccountLoading: false,
  linkGoogleAccountError: undefined,
});

const linkGoogleAccountFailReducer = (
  state: AuthenticationState,
  props: Error
): AuthenticationState => ({
  ...state,
  linkGoogleAccountLoading: false,
  linkGoogleAccountError: props,
});

const reducer = createReducer(
  initialState,
  on(logIn, logInReducer),
  on(logInFail, logInFailReducer),
  on(logInSuccess, logInSuccessReducer),
  on(logOut, logOutReducer),
  on(logOutSuccess, logOutSuccessReducer),
  on(logOutFailed, logOutFailedReducer),
  on(refreshTokenSuccess, refreshTokenSuccessReducer),
  on(refreshTokenFailed, refreshTokenFailedReducer),
  on(activateAccount, activateAccountReducer),
  on(accountActivationSuccess, accountActivationSuccessReducer),
  on(accountActivationFail, accountActivationFailReducer),
  on(setUser, setUserReducer),
  on(signupUser, signupUserReducer),
  on(signupUserSuccess, signupUserSuccessReducer),
  on(signupUserFail, signupUserFailReducer),
  on(reinitPassword, reinitPasswordReducer),
  on(reinitPasswordSuccess, reinitPasswordSuccessReducer),
  on(reinitPasswordFail, reinitPasswordFailReducer),
  on(verifyFailed, verifyFailedReducer),
  on(verifySuccess, verifySuccessReducer),
  on(loadValues, loadValuesReducer),
  on(loadValuesSuccess, loadValuesSuccessReducer),
  on(loadValuesFail, loadValuesFailReducer),
  on(clearError, clearErrorReducer),
  on(googleSignIn, googleSignInReducer),
  on(googleSignInSuccess, googleSignInSuccessReducer),
  on(googleSignInFail, googleSignInFailReducer),
  on(linkGoogleAccount, linkGoogleAccountReducer),
  on(linkGoogleAccountSuccess, linkGoogleAccountSuccessReducer),
  on(linkGoogleAccountFail, linkGoogleAccountFailReducer)
);

export function authenticationReducer(
  state: AuthenticationState | undefined,
  action: Action
) {
  return reducer(state, action);
}
