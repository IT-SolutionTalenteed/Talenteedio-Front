/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs';
import { activateAccount } from '../store/actions/authentication.actions';
import { AuthenticationState } from '../store/reducers/authentication.reducers';
import { getUserLoggedIn } from '../store/selectors/authentication.selectors';
import { getResolvedUrl } from '../utils/getResolvedUrl';

@Injectable()
export class AccountValidationService {
  canActivate(store: Store<AuthenticationState>, router: Router, url: string) {
    return store.pipe(
      select(getUserLoggedIn),
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          router.navigate(['/authentication/sign-in'], {
            queryParams: { redirect: url },
          });
          return false;
        }
        store.dispatch(activateAccount());
        return true;
      })
    );
  }
}

export const AccountValidationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  inject(AccountValidationService).canActivate(
    inject(Store<AuthenticationState>),
    inject(Router),
    getResolvedUrl(route)
  );
