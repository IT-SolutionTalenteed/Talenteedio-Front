/* eslint-disable max-lines-per-function */
import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, catchError, flatMap, map, of, take } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import {
  verifyFailed,
  verifySuccess,
} from 'src/app/authentication/store/actions/authentication.actions';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getAccessToken } from 'src/app/authentication/store/selectors/authentication.selectors';

@Injectable()
export class VerifyService {
  canActivate(
    state: RouterStateSnapshot,
    authenticationStore: Store<AuthenticationState>,
    router: Router,
    authenticationService: AuthenticationService
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return authenticationStore.pipe(
      select(getAccessToken),
      take(1),
      flatMap((token: string) => {
        if (token) {
          return authenticationService.me().pipe(
            map((res) => {
              authenticationStore.dispatch(verifySuccess(res.user));
              return true;
            }),
            catchError((error) => {
              authenticationStore.dispatch(verifyFailed(new Error('no token')));
              return of(true);
            })
          );
        } else {
          authenticationStore.dispatch(verifyFailed(new Error('no token')));
          return of(true);
        }
      })
    );
  }
}

export const VerifyGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  inject(VerifyService).canActivate(
    state,
    inject(Store<AuthenticationState>),
    inject(Router),
    inject(AuthenticationService)
  );
