import { Action, createReducer, on } from '@ngrx/store';
import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
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

export interface UserState {
  users: Paginated<User>;
  usersLoaded: boolean;
  usersLoading: boolean;
  userCriteria: ListCriteria;
  user: User;
  userLoaded: boolean;
  userLoading: boolean;
  userSaved: boolean;
  userSaving: boolean;
  userDeleting: boolean;
  userDeleted: boolean;
  roles: Role[];
  rolesLoading: boolean;
  rolesLoaded: boolean;
}

const initialState: UserState = {
  users: { items: [], totalItems: 0 },
  usersLoaded: false,
  usersLoading: false,
  userCriteria: null,
  user: undefined,
  userLoaded: false,
  userLoading: false,
  userSaving: false,
  userSaved: false,
  userDeleting: false,
  userDeleted: false,
  roles: [],
  rolesLoading: false,
  rolesLoaded: false,
};

const loadUsersReducer = (
  state: UserState,
  props: ListCriteria
): UserState => ({
  ...state,
  usersLoading: true,
  usersLoaded: false,
  userCriteria: props,
});

const loadUsersFailReducer = (state: UserState): UserState => ({
  ...state,
  usersLoading: false,
  usersLoaded: false,
});

const loadUsersSuccessReducer = (
  state: UserState,
  props: Paginated<User>
): UserState => ({
  ...state,
  usersLoading: false,
  usersLoaded: true,
  users: props,
});

const loadUserReducer = (state: UserState): UserState => ({
  ...state,
  userLoading: true,
  userLoaded: false,
});

const loadUserFailReducer = (state: UserState): UserState => ({
  ...state,
  userLoading: false,
  userLoaded: false,
});

const loadUserSuccessReducer = (state: UserState, props: User): UserState => ({
  ...state,
  userLoading: false,
  userLoaded: true,
  user: props,
});

const saveUserReducer = (state: UserState): UserState => ({
  ...state,
  userSaving: true,
  userSaved: false,
});

const saveUserFailReducer = (state: UserState): UserState => ({
  ...state,
  userSaving: false,
  userSaved: false,
});

const saveUserSuccessReducer = (state: UserState, props: User): UserState => ({
  ...state,
  userSaving: false,
  userSaved: true,
  user: props,
});

const deleteUserReducer = (state: UserState): UserState => ({
  ...state,
  userDeleting: true,
  userDeleted: false,
});

const deleteUserFailReducer = (state: UserState): UserState => ({
  ...state,
  userDeleting: false,
  userSaved: false,
});

const deleteUserSuccessReducer = (state: UserState): UserState => ({
  ...state,
  userDeleting: false,
  userDeleted: true,
});

const loadRolesReducer = (state: UserState): UserState => ({
  ...state,
  rolesLoading: true,
  rolesLoaded: false,
});

const loadRolesFailReducer = (state: UserState): UserState => ({
  ...state,
  rolesLoading: false,
  rolesLoaded: false,
});

const loadRolesSuccessReducer = (state: UserState, { roles }): UserState => ({
  ...state,
  rolesLoading: false,
  rolesLoaded: true,
  roles,
});

const reducer = createReducer(
  initialState,
  on(deleteUser, deleteUserReducer),
  on(deleteUserFail, deleteUserFailReducer),
  on(deleteUserSuccess, deleteUserSuccessReducer),
  on(loadRoles, loadRolesReducer),
  on(loadRolesFail, loadRolesFailReducer),
  on(loadRolesSuccess, loadRolesSuccessReducer),
  on(loadUser, loadUserReducer),
  on(loadUserFail, loadUserFailReducer),
  on(loadUsers, loadUsersReducer),
  on(loadUsersFail, loadUsersFailReducer),
  on(loadUsersSuccess, loadUsersSuccessReducer),
  on(loadUserSuccess, loadUserSuccessReducer),
  on(saveUser, saveUserReducer),
  on(saveUserFail, saveUserFailReducer),
  on(saveUserSuccess, saveUserSuccessReducer)
);

export function userReducer(state: UserState | undefined, action: Action) {
  return reducer(state, action);
}
