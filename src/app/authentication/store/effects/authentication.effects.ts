/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  back,
  go,
  navigationLaunched,
  showSuccess,
} from 'src/app/routeur/store/actions/router.actions';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import { getRouterState } from 'src/app/routeur/store/selectors/router.selectors';
import { User } from 'src/app/shared/models/user.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { AuthenticationResponse } from '../../types/authentication-response.interface';
import { Credentials } from '../../types/credentials.interface';
import {
  accountActivationFail,
  accountActivationSuccess,
  activateAccount,
  loadValues,
  loadValuesFail,
  loadValuesSuccess,
  logIn,
  logInFail,
  logInSuccess,
  logOut,
  logOutFailed,
  refreshTokenFailed,
  reinitPassword,
  reinitPasswordFail,
  reinitPasswordSuccess,
  signupUser,
  signupUserFail,
  signupUserSuccess,
  verifyFailed,
} from '../actions/authentication.actions';
import { logOutSuccess } from './../actions/authentication.actions';

@Injectable()
export class AuthenticationEffects {
  constructor(
    private action$: Actions,
    private authenticationService: AuthenticationService,
    private routerStore: Store<AppRouterState>,
    private gaService: GoogleAnalyticsService
  ) {}

  logIn$ = createEffect(() =>
    this.action$.pipe(
      ofType(logIn),
      switchMap((props: Credentials) =>
        this.authenticationService.logIn(props).pipe(
          mergeMap((response: AuthenticationResponse) =>
            // this.gaService.event('login', 'user_login_form', props.email);
            [showSuccess({ message: '' }), logInSuccess(response)]
          ),
          catchError((error) => of(logInFail(error)))
        )
      )
    )
  );

  signupUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(signupUser),
      switchMap((props: { payload: User }) =>
        this.authenticationService.signUpUser(props.payload).pipe(
          // this.gaService.event(
          //     'register',
          //     'user_register_form',
          //     props.payload.email
          //   );
          mergeMap((response: AuthenticationResponse) => [
            showSuccess({ message: '' }),
            signupUserSuccess(response),
            // logInSuccess(response),
          ]),
          catchError((error) => of(signupUserFail(error)))
        )
      )
    )
  );

  activateAccount$ = createEffect(() =>
    this.action$.pipe(
      ofType(activateAccount),
      withLatestFrom(this.routerStore.pipe(select(getRouterState))),
      map(([action, routerState]) => routerState.state.params['token']),
      switchMap((token: string) =>
        this.authenticationService.activateAccount(token).pipe(
          map((response: { user: User }) =>
            accountActivationSuccess({ user: response.user })
          ),
          catchError((error) => of(accountActivationFail(error)))
        )
      )
    )
  );

  logInSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(logInSuccess),
      tap((props: AuthenticationResponse) =>
        this.gaService.event('login', 'user_login_form', props.user.email)
      ),
      withLatestFrom(this.routerStore.pipe(select(getRouterState))),
      map(([action, routerState]) => routerState.state.queryParams['redirect']),
      map((redirect: string) =>
        redirect ? go({ path: [`${redirect}`] }) : go({ path: ['/home'] })
      )
    )
  );

  signupUserSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(signupUserSuccess),
      tap((props: AuthenticationResponse) =>
        this.gaService.event('register', 'user_register_form', props.user.email)
      ),
      map(() => navigationLaunched())
    )
  );

  logOut$ = createEffect(() =>
    this.action$.pipe(
      ofType(logOut),
      switchMap(() =>
        this.authenticationService.logOut().pipe(
          mergeMap((response) => [
            showSuccess({ message: response.msg }),
            logOutSuccess(),
          ]),
          catchError((error) => of(logOutFailed()))
        )
      )
      // map(() => go({ path: ['/authentication'] }))
    )
  );

  logOutSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(logOutSuccess),
        tap(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-admin');
          }
        })
      ),
    { dispatch: false }
  );
  verifyFailed$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(verifyFailed),
        tap(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-admin');
          }
        })
      ),
    { dispatch: false }
  );
  refreshTokenFailed$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(refreshTokenFailed),
        tap(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-admin');
          }
        })
      ),
    { dispatch: false }
  );
  reinitiPassword$ = createEffect(() =>
    this.action$.pipe(
      ofType(reinitPassword),
      switchMap((props: { payload: string }) =>
        this.authenticationService.resetPassword(props.payload).pipe(
          mergeMap(() => [
            showSuccess({ message: '' }),
            reinitPasswordSuccess(),
            back(),
          ]),
          catchError((error) => of(reinitPasswordFail(error)))
        )
      )
    )
  );

  loadValues$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadValues),
      switchMap(() =>
        this.authenticationService.loadValues().pipe(
          map((response: Value[]) => loadValuesSuccess({ payload: response })),
          catchError((error) => of(loadValuesFail(error)))
        )
      )
    )
  );
}
