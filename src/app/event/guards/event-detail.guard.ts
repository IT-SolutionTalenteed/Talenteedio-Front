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
        // Toujours permettre l'accès à la page
        // Le composant gérera l'affichage du contenu selon le rôle
        if (!route.data['roles']?.includes(role?.name)) {
          // Afficher le modal seulement si l'utilisateur n'a pas le bon rôle
          authenticationStore.dispatch(openBecomeMemberModal());
        }
        return true;
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
