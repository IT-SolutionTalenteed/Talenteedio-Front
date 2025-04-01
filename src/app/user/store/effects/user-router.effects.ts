import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import {
  USER_BASE_ROUTE,
  USER_DEFAULT_CRITERIA,
  USER_DETAIL_ROUTE_REGEX,
  USER_ROUTE,
} from '../../constants/user.constant';
import { UserService } from '../../services/user.service';
import {
  loadRoles,
  loadUser,
  loadUserSuccess,
  loadUsers,
} from '../actions/user.actions';
import { UserState } from '../reducers/user.reducers';
import { getUserCriteria } from '../selectors/user.selectors';

@Injectable()
export class UserRouterEffects {
  constructor(
    private action$: Actions,
    private userStore: Store<UserState>,
    private userService: UserService
  ) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  userRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      withLatestFrom(this.userStore.pipe(select(getUserCriteria))),
      filter(
        ([routerState, criteria]) =>
          routerState.url.includes(USER_BASE_ROUTE) && !criteria
      ),
      map(([routerState]) => loadUsers(this.mergedCriteria(routerState)))
    )
  );

  userFormRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter((routerState) => USER_DETAIL_ROUTE_REGEX.test(routerState.url)),
      map((routerState) => loadUser({ id: routerState.params['userId'] }))
    )
  );

  userNewRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter((state) => state.url.includes('user/new')),
      switchMap(() =>
        this.userService
          .userFactory()
          .pipe(map((response: User) => loadUserSuccess(response)))
      )
    )
  );

  roleRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        (state) =>
          state.url.includes(`${USER_ROUTE}/edit`) ||
          state.url.includes(`${USER_ROUTE}/detail`) ||
          state.url.includes(`${USER_ROUTE}/new`)
      ),
      map(() => loadRoles())
    )
  );

  private idHasChanged(routerState: AppRouterState, user: User): boolean {
    return routerState.params['userId'] !== (user && user.id);
  }

  private mergedCriteria(routerState: AppRouterState): ListCriteria {
    // Below, Merge default criteria with others criterias from queryParams if there is any:
    return { ...USER_DEFAULT_CRITERIA };
  }
}
