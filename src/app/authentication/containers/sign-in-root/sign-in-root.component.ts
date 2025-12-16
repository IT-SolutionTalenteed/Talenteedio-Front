import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logIn, clearError, googleSignIn } from '../../store/actions/authentication.actions';
import { AuthenticationState } from '../../store/reducers/authentication.reducers';
import {
  getEmailError,
  getEmailErrorMessage,
  getUserLoggingIn,
} from '../../store/selectors/authentication.selectors';
import { Credentials } from '../../types/credentials.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-root',
  templateUrl: './sign-in-root.component.html',
  styleUrls: ['./sign-in-root.component.scss'],
})
export class SignInRootComponent implements OnInit {
  loading$: Observable<boolean>;
  emailErrorMessage$: Observable<string>;
  emailError$: Observable<Error>;

  // Google registration modal state
  showGoogleRegisterModal = false;
  googleCredential = '';
  googleData: any = null;
  registrationError = '';
  
  // Google info message
  showGoogleInfoMessage = false;
  googleInfoMessage = '';

  constructor(
    private authenticationStore: Store<AuthenticationState>,
    private authService: AuthenticationService,
    private router: Router
  ) {}

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

  onClearError() {
    this.authenticationStore.dispatch(clearError());
  }

  onGoogleSignIn(credential: string) {
    // Essayer la connexion d'abord
    this.authService.googleSignIn(credential).subscribe({
      next: (response) => {
        // Connexion réussie - utiliser le store pour gérer la suite
        this.authenticationStore.dispatch(googleSignIn({ credential }));
      },
      error: (error) => {
        if (error.needsRegistration && error.googleData) {
          // Afficher le modal d'inscription
          this.googleCredential = credential;
          this.googleData = error.googleData;
          this.showGoogleRegisterModal = true;
        } else {
          // Autre erreur - utiliser le store pour l'afficher
          this.authenticationStore.dispatch(googleSignIn({ credential }));
        }
      }
    });
  }

  onGoogleRegistrationComplete(response: any) {
    this.showGoogleRegisterModal = false;
    
    if (response.pending) {
      // Compte consultant en attente
      this.router.navigate(['/authentication/sign-in'], {
        queryParams: { message: 'Votre compte consultant est en attente de validation.' }
      });
    } else {
      // Inscription réussie - rediriger vers le dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  onGoogleRegistrationCancel() {
    this.showGoogleRegisterModal = false;
    this.googleCredential = '';
    this.googleData = null;
  }
}
