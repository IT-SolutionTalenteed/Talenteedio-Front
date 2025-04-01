import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getUserLoggedIn } from 'src/app/authentication/store/selectors/authentication.selectors';
import { getResolvedUrl } from '../utils/getResolvedUrl';

@Injectable()
export class AuthenticationService {
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
        return true;
      })
    );
  }
}

export const AuthenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  inject(AuthenticationService).canActivate(
    inject(Store<AuthenticationState>),
    inject(Router),
    getResolvedUrl(route)
  );
