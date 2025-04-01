import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from 'src/app/shared/models/role.interface';
import { ApiResponse } from 'src/app/shared/types/api-response.interface';
import { flatten } from 'src/app/shared/utils/flatten';
import { environment } from 'src/environments/environment';
import { ListCriteria } from '../../shared/types/list-criteria.interface';
import { Paginated } from '../../shared/types/paginated.interface';
import { EMPTY_ROLE, ROLE_ROUTE } from '../constants/role.constant';
import { RoleServiceInterface } from './role-service.interface';

@Injectable()
export class RoleService implements RoleServiceInterface {
  constructor(private http: HttpClient) {}

  loadRoles(criteria: ListCriteria): Observable<Paginated<Role>> {
    return this.http
      .get(`${environment.apiBaseUrl}/${ROLE_ROUTE}`, {
        params: flatten(criteria),
      })
      .pipe(map((result: ApiResponse) => result.data as Paginated<Role>));
  }

  loadRole(roleId: string): Observable<Role> {
    return this.http
      .get(`${environment.apiBaseUrl}/${ROLE_ROUTE}/${roleId}`)
      .pipe(map((result: ApiResponse) => result.data as Role));
  }

  saveRole(role: Role): Observable<Role> {
    return role.id
      ? this.http
          .put(`${environment.apiBaseUrl}/${ROLE_ROUTE}/${role.id}`, role)
          .pipe(map((result: ApiResponse) => result.data as Role))
      : this.http
          .post(`${environment.apiBaseUrl}/${ROLE_ROUTE}`, {
            ...role,
            id: undefined,
          })
          .pipe(map((result: ApiResponse) => result.data as Role));
  }

  deleteRole(role: Role): Observable<boolean> {
    return this.http
      .delete(`${environment.apiBaseUrl}/${ROLE_ROUTE}/${role.id}`)
      .pipe(
        map(
          (result: ApiResponse) =>
            result.message === 'Role successfully deleted'
        )
      );
  }

  roleFactory(): Observable<Role> {
    return of(EMPTY_ROLE);
  }

  checkDuplication(role: Role): Observable<object | null> {
    return this.http
      .post(`${environment.apiBaseUrl}/${ROLE_ROUTE}/check-duplication`, role)
      .pipe(
        map((response: ApiResponse) => response.data as unknown as boolean),
        map((hasDuplicate) => (hasDuplicate ? { duplicateEntry: true } : null))
      );
  }
}
