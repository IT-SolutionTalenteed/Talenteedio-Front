import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { USER_BASE_ROUTE } from '../../constants/user.constant';
import { saveUser } from '../../store/actions/user.actions';
import { UserState } from '../../store/reducers/user.reducers';
import {
  getFormIsLoading,
  getRoles,
  getUser,
  getUserEditing
} from '../../store/selectors/user.selectors';

@Component({
    selector: 'app-user-form-root',
    templateUrl: './user-form-root.component.html',
    styleUrls: ['./user-form-root.component.scss']
})
export class UserFormRootComponent implements OnInit {
    user$: Observable<User>;
    roles$: Observable<Role[]>;
    formIsLoading$: Observable<boolean>;
    isEditing$: Observable<boolean>;

    constructor(
        private userStore: Store<UserState>,
        private authenticationStore: Store<AuthenticationState>
    ) {}

    ngOnInit() {
        this.user$ = this.userStore.pipe(select(getUser));
        this.roles$ = this.userStore.pipe(select(getRoles));
        this.formIsLoading$ = this.userStore.pipe(select(getFormIsLoading));
        this.isEditing$ = this.userStore.pipe(select(getUserEditing));
    }

    onEdit(user: User) {
        this.go([`${USER_BASE_ROUTE}/edit`, user.id]);
    }

    onSave(user: User) {
        this.userStore.dispatch(saveUser(user));
    }

    onCancelEdit(user: User) {
        this.go(user.id ? [`${USER_BASE_ROUTE}/detail`, user.id] : [`${USER_BASE_ROUTE}`]);
    }

    onClose() {
        this.go([USER_BASE_ROUTE]);
    }

    private go(path: string[]) {
        this.userStore.dispatch(go({ path }));
    }
}
