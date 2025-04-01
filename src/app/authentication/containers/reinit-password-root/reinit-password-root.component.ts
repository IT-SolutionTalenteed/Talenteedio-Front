import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { reinitPassword } from '../../store/actions/authentication.actions';
import { AuthenticationState } from '../../store/reducers/authentication.reducers';
import { getReinitPasswordLoading } from '../../store/selectors/authentication.selectors';

@Component({
    selector: 'app-reinit-password-root',
    templateUrl: './reinit-password-root.component.html',
    styleUrls: ['./reinit-password-root.component.scss']
})
export class ReinitPasswordRootComponent {
    loading$: Observable<boolean>;
    constructor(private authenticationStore: Store<AuthenticationState>) {}

    onReinitPassword(email: string) {
        this.authenticationStore.dispatch(reinitPassword({ payload: email }));
        this.loading$ = this.authenticationStore.pipe(select(getReinitPasswordLoading));
    }
}
