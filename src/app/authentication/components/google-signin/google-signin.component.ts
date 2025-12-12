import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent implements OnInit, OnDestroy {
  @Output() googleSignIn = new EventEmitter<string>();
  @Input() disabled = false;
  @Input() buttonText = 'Se connecter avec Google';
  
  isLoading = false;

  constructor(private googleAuthService: GoogleAuthService) {}

  async ngOnInit() {
    try {
      await this.googleAuthService.initialize(environment.googleClientId);
      this.setupGoogleButton();
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private setupGoogleButton() {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular'
        }
      );
    }
  }

  private handleGoogleResponse(response: any) {
    if (response.credential) {
      this.isLoading = true;
      this.googleSignIn.emit(response.credential);
    } else {
      console.error('No credential received from Google');
    }
  }

  onManualSignIn() {
    if (this.disabled || this.isLoading) return;

    this.isLoading = true;
    
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google Sign-In prompt not displayed');
          this.isLoading = false;
        }
      });
    }
  }
}