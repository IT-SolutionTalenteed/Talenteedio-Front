import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';

export interface UserServiceInterface {
    loadUsers(criteria: ListCriteria): Observable<Paginated<User>>;
    loadUser(userId: string): Observable<User>;
    userFactory(): Observable<User>;
    deleteUser(user: User): Observable<void>;
    saveUser(user: User): Observable<User>;
    loadRoles(): Observable<Role[]>;
    checkDuplication(role: Role): Observable<object | null>;
}
