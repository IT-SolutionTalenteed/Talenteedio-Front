import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/models/role.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';

export interface RoleServiceInterface {
    loadRoles(criteria: ListCriteria): Observable<Paginated<Role>>;
    saveRole(role: Role): Observable<Role>;
    deleteRole(role: Role): Observable<boolean>;
    roleFactory(): Observable<Role>;
    checkDuplication(role: Role): Observable<object | null>;
}
