import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logIn } from '../../store/actions/authentication.actions';
import { AuthenticationState } from '../../store/reducers/authentication.reducers';
import {
  getEmailError,
  getEmailErrorMessage,
  getUserLoggingIn,
} from '../../store/selectors/authentication.selectors';
import { Credentials } from '../../types/credentials.interface';

@Component({
  selector: 'app-sign-in-root',
  templateUrl: './sign-in-root.component.html',
  styleUrls: ['./sign-in-root.component.scss'],
})
export class SignInRootComponent implements OnInit {
  loading$: Observable<boolean>;
  emailErrorMessage$: Observable<string>;
  emailError$: Observable<Error>;

  constructor(private authenticationStore: Store<AuthenticationState>) {}

  ngOnInit() {
    this.loading$ = this.authenticationStore.pipe(select(getUserLoggingIn));
    this.emailErrorMessage$ = this.authenticationStore.pipe(
      select(getEmailErrorMessage)
    );
    this.emailError$ = this.authenticationStore.pipe(select(getEmailError));
  }

  onLogIn(credentials: Credentials) {
    this.authenticationStore.dispatch(logIn(credentials));
  }
}
