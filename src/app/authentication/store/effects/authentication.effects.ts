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
  timeout,
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
          catchError((error) => {
            console.log('Login error caught:', error);
            return of(logInFail(error));
          }),
          // Timeout de sécurité pour éviter la boucle infinie
          timeout(10000),
          catchError((timeoutError) => {
            console.log('Login timeout or error:', timeoutError);
            return of(logInFail(new Error('Timeout ou erreur de connexion')));
          })
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
      map(([action, routerState]) => {
        const currentUrl = routerState.state.url;
        const redirect = routerState.state.queryParams['redirect'];
        
        // Si on est sur la page matching-profile, ne pas rediriger
        if (currentUrl && currentUrl.includes('/matching-profile')) {
          return { type: 'NO_ACTION' }; // Action vide pour ne rien faire
        }
        
        // Sinon, rediriger normalement
        return redirect ? go({ path: [`${redirect}`] }) : go({ path: ['/home'] });
      })
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
        withLatestFrom(this.routerStore.pipe(select(getRouterState))),
        tap(([action, routerState]) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-admin');
            
            // Si on est sur la page matching-profile, recharger la page
            const currentUrl = routerState.state.url;
            if (currentUrl && currentUrl.includes('/matching-profile')) {
              window.location.reload();
            }
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

  googleSignIn$ = createEffect(() =>
    this.action$.pipe(
      ofType(googleSignIn),
      switchMap((props: { credential: string }) =>
        this.authenticationService.googleSignIn(props.credential).pipe(
          mergeMap((response: AuthenticationResponse) => [
            showSuccess({ message: 'Connexion Google réussie' }),
            googleSignInSuccess(response)
          ]),
          catchError((error) => {
            console.log('Google sign-in error caught:', error);
            return of(googleSignInFail(error));
          }),
          timeout(10000),
          catchError((timeoutError) => {
            console.log('Google sign-in timeout:', timeoutError);
            return of(googleSignInFail(new Error('Timeout de connexion Google')));
          })
        )
      )
    )
  );

  googleSignInSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(googleSignInSuccess),
      tap((props: AuthenticationResponse) =>
        this.gaService.event('login', 'google_login', props.user.email)
      ),
      withLatestFrom(this.routerStore.pipe(select(getRouterState))),
      map(([action, routerState]) => {
        const currentUrl = routerState.state.url;
        const redirect = routerState.state.queryParams['redirect'];
        
        // Si on est sur la page matching-profile, ne pas rediriger
        if (currentUrl && currentUrl.includes('/matching-profile')) {
          return { type: 'NO_ACTION' }; // Action vide pour ne rien faire
        }
        
        // Sinon, rediriger normalement
        return redirect ? go({ path: [`${redirect}`] }) : go({ path: ['/home'] });
      })
    )
  );

  linkGoogleAccount$ = createEffect(() =>
    this.action$.pipe(
      ofType(linkGoogleAccount),
      switchMap((props: { credential: string }) =>
        this.authenticationService.linkGoogleAccount(props.credential).pipe(
          mergeMap(() => [
            showSuccess({ message: 'Compte Google lié avec succès' }),
            linkGoogleAccountSuccess()
          ]),
          catchError((error) => {
            console.log('Link Google account error caught:', error);
            return of(linkGoogleAccountFail(error));
          })
        )
      )
    )
  );
}
