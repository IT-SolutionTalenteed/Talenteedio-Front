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
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getUserRole } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Role } from 'src/app/shared/models/role.interface';
import { openBecomeMemberModal } from 'src/app/shared/store/actions/shared.actions';

@Injectable()
export class EventDetailService {
  canActivate(
    state: RouterStateSnapshot,
    route: ActivatedRouteSnapshot,
    authenticationStore: Store<AuthenticationState>,
    router: Router
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return authenticationStore.pipe(
      select(getUserRole),
      map((role: Role) => {
        if (route.data['roles'].includes(role?.name)) {
          return true;
        } else {
          authenticationStore.dispatch(openBecomeMemberModal());
          router.navigate([router.url]);
          return false;
        }
      })
    );
  }
}

export const EventDetailGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  inject(EventDetailService).canActivate(
    state,
    route,
    inject(Store<AuthenticationState>),
    inject(Router)
  );
