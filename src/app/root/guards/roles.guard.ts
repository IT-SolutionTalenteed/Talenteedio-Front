import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getUserRole } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Role } from 'src/app/shared/models/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {
    constructor(private store: Store<AuthenticationState>) { }
    canActivate(route: ActivatedRouteSnapshot) {
        return this.store.pipe(
            select(getUserRole),
            map(
                (role: Role) =>(route.data['roles'].includes(role.name))
            )
        );
    }
}
