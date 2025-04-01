import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ROLES_MOCK } from 'src/app/role/models/roles.mock';
import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { paginate } from 'src/app/shared/utils/paginate';
import { EMPTY_USER } from '../constants/user.constant';
import { USERS_MOCK } from '../models/users.mock';
import { UserServiceInterface } from './user-service.interface';

@Injectable()
export class UserMockService implements UserServiceInterface {
    constructor() {
        /** */
    }

    loadUsers(criteria: ListCriteria): Observable<Paginated<User>> {
        return of({
            items: paginate(USERS_MOCK, criteria.page),
            totalItems: USERS_MOCK.length,
        }).pipe(delay(2500));
    }

    loadUser(userId: string): Observable<User> {
        return of(USERS_MOCK.find((u) => u.id === userId));
    }

    userFactory(): Observable<User> {
        return of(EMPTY_USER);
    }

    deleteUser(user: User): Observable<void> {
        return null;
    }

    saveUser(user: User): Observable<User> {
        return of(user);
    }

    loadRoles(): Observable<Role[]> {
        return of(ROLES_MOCK).pipe(delay(2500));
    }

    checkDuplication(role: Role): Observable<object | null> {
        return of(null);
    }
}
