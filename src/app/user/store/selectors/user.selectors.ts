import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { getUserPrivileges } from 'src/app/authentication/store/selectors/authentication.selectors';
import { getRouterState } from 'src/app/routeur/store/selectors/router.selectors';
import { User } from 'src/app/shared/models/user.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { UserState } from '../reducers/user.reducers';

export const getUserState = createFeatureSelector<UserState>('user');

export const getPaginatedUsers = createSelector(getUserState, (state: UserState) => state.users);

export const getUsers = createSelector(getPaginatedUsers, (paginatedUsers: Paginated<User>) => paginatedUsers.items);

export const getUsersTotalItems = createSelector(getPaginatedUsers, (paginatedUsers: Paginated<User>) => paginatedUsers.totalItems);

export const getUserCriteria = createSelector(getUserState, (state: UserState) => state.userCriteria);

export const getUsersLoading = createSelector(getUserState, (state: UserState) => state.usersLoading);

export const getUser = createSelector(getUserState, (state: UserState) => state.user);

export const getUserLoading = createSelector(getUserState, (state: UserState) => state.userLoading);

export const getUserSaving = createSelector(getUserState, (state: UserState) => state.userSaving);

export const getUserSaved = createSelector(getUserState, (state: UserState) => state.userSaved);

export const getFormIsLoading = createSelector(getUserLoading, getUserSaving, (loading: boolean, saving: boolean) => loading || saving);

// export const getUserEditEnabled = createSelector(getUserPrivileges, (privileges: Privilege[] = []) =>
//     privileges.some((p) => p.name === UserPrivileges.EDIT_USER)
// );

// export const getUserDeleteEnabled = createSelector(getUserPrivileges, (privileges: Privilege[] = []) =>
//     privileges.some((p) => p.name === UserPrivileges.DELETE_USER)
// );

// export const getUserCreateEnabled = createSelector(getUserPrivileges, (privileges: Privilege[] = []) =>
//     privileges.some((p) => p.name === UserPrivileges.CREATE_USER)
// );

export const getUserEditing = createSelector(
    getRouterState,
    // tslint:disable-next-line: no-duplicate-string
    (router) => router.state.url.includes('user/edit') || router.state.url.includes('user/new')
);

export const getUserCreating = createSelector(getRouterState, (router) => router.state.url.includes('user/new'));

export const getIsEditingOrDetail = createSelector(
    getRouterState,
    (router) => router.state.url.includes('user/detail') || router.state.url.includes('user/edit') || router.state.url.includes('user/new')
);


export const getRoles = createSelector(getUserState, (state: UserState) => state.roles);
