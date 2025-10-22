/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { setUser } from 'src/app/authentication/store/actions/authentication.actions';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { USER_BASE_ROUTE } from '../../constants/user.constant';
import { UserService } from '../../services/user.service';
import {
  deleteUser,
  deleteUserFail,
  deleteUserSuccess,
  loadRoles,
  loadRolesFail,
  loadRolesSuccess,
  loadUser,
  loadUserFail,
  loadUserSuccess,
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
  saveUser,
  saveUserFail,
  saveUserSuccess,
} from '../actions/user.actions';
import { UserState } from '../reducers/user.reducers';
import { getUserCriteria } from '../selectors/user.selectors';

@Injectable()
export class UserEffects {
  constructor(
    private action$: Actions,
    private userService: UserService,
    private store: Store<UserState>
  ) {}

  loadUsers$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadUsers),
      switchMap(({ type, ...props }) =>
        this.userService.loadUsers(props).pipe(
          map((response: Paginated<User>) => loadUsersSuccess(response)),
          catchError((error) => of(loadUsersFail(error)))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadUser),
      switchMap(({ id }) =>
        this.userService.loadUser(id).pipe(
          map((response: User) => loadUserSuccess(response)),
          catchError((error) => of(loadUserFail(error)))
        )
      )
    )
  );

  saveUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(saveUser),
      switchMap(({ type, ...props }) =>
        this.userService.saveUser(props).pipe(
          map((response: User) => saveUserSuccess(response)),
          catchError((error) => of(saveUserFail(error)))
        )
      )
    )
  );

  saveUserSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(saveUserSuccess),
      withLatestFrom(
        this.store.pipe(select(getUserCriteria)),
        this.store.pipe(select(getLoggedUser))
      ),
      mergeMap(([props, criteria, loggedUser]: [User, ListCriteria, User]) => {
        const actions: any[] = [
          go({
            path: [`${USER_BASE_ROUTE}/detail`, props.id],
          }),
          loadUsers(criteria),
        ];
        
        // Si l'utilisateur modifié est l'utilisateur connecté, mettre à jour le store d'authentification
        if (loggedUser && props.id === loggedUser.id) {
          actions.push(setUser(props));
        }
        
        return actions;
      })
    )
  );

  deleteUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteUser),
      switchMap((props: User) =>
        this.userService.deleteUser(props).pipe(
          mergeMap(() => [
            deleteUserSuccess(),
            go({
              path: [`${USER_BASE_ROUTE}`],
            }),
          ]),
          catchError((error) => of(deleteUserFail(error)))
        )
      )
    )
  );

  deleteUserSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteUserSuccess),
      withLatestFrom(this.store.pipe(select(getUserCriteria))),
      map(([props, criteria]) => loadUsers(criteria))
    )
  );

  loadRoles$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadRoles),
      mergeMap((props) =>
        this.userService.loadRoles().pipe(
          map((response: Role[]) => loadRolesSuccess({ roles: response })),
          catchError((error) => of(loadRolesFail(error)))
        )
      )
    )
  );
}
