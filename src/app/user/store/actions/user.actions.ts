import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';

export const loadUsers = createAction('[User] Load Users', props<ListCriteria>());

export const loadUsersSuccess = createAction('[User] Load Users Success', props<Paginated<User>>());

export const loadUsersFail = createAction('[User] Load Users Fail', props<Error>());

export const loadUser = createAction('[User] Load User', props<{ id: string }>());

export const loadUserSuccess = createAction('[User] Load User Success', props<User>());

export const loadUserFail = createAction('[User] Load User Fail', props<Error>());

export const saveUser = createAction('[User] Save User', props<User>());

export const saveUserFail = createAction('[User] Save User Fail', props<Error>());

export const saveUserSuccess = createAction('[User] Save User Success', props<User>());

export const deleteUser = createAction('[User] Delete User', props<User>());

export const deleteUserFail = createAction('[User] Delete User Fail', props<Error>());

export const deleteUserSuccess = createAction('[User] Delete User Success');


export const loadRoles = createAction('[User] Load Roles');

export const loadRolesFail = createAction(
    '[User] Load Roles Fail',
    props<{ error: HttpErrorResponse }>()
);

export const loadRolesSuccess = createAction(
    '[User] Load Roles Success',
    props<{ roles: Role[] }>()
);
