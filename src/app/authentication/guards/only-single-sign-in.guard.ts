import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AUTHENTICATION_BASE_ROUTE } from '../constants/authentication.constant';
import { AuthenticationState } from '../store/reducers/authentication.reducers';
import { getUserLoggedIn } from '../store/selectors/authentication.selectors';

@Injectable()
export class OnlySingleSignInService {
  canActivate(
    state: RouterStateSnapshot,
    authenticationStore: Store<AuthenticationState>,
    router: Router
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return authenticationStore.pipe(
      select(getUserLoggedIn),
      map((isLoggedIn) => {
        if (isLoggedIn && state.url.includes(AUTHENTICATION_BASE_ROUTE)) {
          router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}

export const OnlySingleSignInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  inject(OnlySingleSignInService).canActivate(
    state,
    inject(Store<AuthenticationState>),
    inject(Router)
  );
