import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

declare global {
  interface Window {
    google: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = ''; // À configurer dans environment
  private isInitialized = false;

  constructor() {
    this.loadGoogleScript();
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
      document.head.appendChild(script);
    });
  }

  async initialize(clientId: string): Promise<void> {
    if (this.isInitialized) return;

    await this.loadGoogleScript();
    this.clientId = clientId;

    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: () => {}, // Will be overridden per use
        auto_select: false,
        cancel_on_tap_outside: true
      });
      this.isInitialized = true;
    }
  }

  signIn(): Observable<any> {
    return new Observable(observer => {
      if (!this.isInitialized) {
        observer.error(new Error('Google Auth not initialized'));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => {
          if (response.credential) {
            observer.next(response);
            observer.complete();
          } else {
            observer.error(new Error('No credential received'));
          }
        }
      });

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%'
            }
          );
        }
      });
    });
  }

  renderButton(elementId: string, options?: any): void {
    if (!this.isInitialized) return;

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'signin_with'
    };

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      { ...defaultOptions, ...options }
    );
  }

  decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
}