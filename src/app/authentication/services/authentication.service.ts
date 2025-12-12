import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Value } from 'src/app/shared/models/value.interface';
import { ApiResponse } from 'src/app/shared/types/api-response.interface';
import { environment } from 'src/environments/environment';
import { AuthenticationResponse } from '../types/authentication-response.interface';
import { Credentials } from '../types/credentials.interface';
import { AuthenticationServiceInterface } from './authentication-service.interface';

@Injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  constructor(private http: HttpClient, private apollo: Apollo) {}

  logIn(credentials: Credentials): Observable<AuthenticationResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Captcha-Response': credentials.recaptcha,
    });
    const { recaptcha, ...apiData } = credentials;
    return this.http
      .post(`${environment.apiBaseUrl}/login`, apiData, { headers })
      .pipe(
        map((response: ApiResponse) => {
          return response as AuthenticationResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          const errorObj = {
            message: error.error?.msg || error.message || 'Email ou mot de passe incorrect',
            status: error.status,
            error: error.error
          };
          return throwError(errorObj);
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logOut(): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/logout`, {});
  }

  activateAccount(token: string): Observable<AuthenticationResponse> {
    return this.http
      .post(`${environment.apiBaseUrl}/verify-email`, { token })
      .pipe(map((response: ApiResponse) => response as AuthenticationResponse));
  }

  refreshToken(credentials: string): Observable<AuthenticationResponse> {
    return this.http
      .post(`${environment.apiBaseUrl}/refresh-token`, {
        refreshToken: credentials,
      })
      .pipe(map((response: ApiResponse) => response as AuthenticationResponse));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signUpUser(client: any): Observable<AuthenticationResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Captcha-Response': client.recaptcha,
    });
    const { recaptcha, ...apiData } = client;
    return this.http
      .post(`${environment.apiBaseUrl}/register`, apiData, { headers })
      .pipe(map((response: ApiResponse) => response as AuthenticationResponse));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetPassword(email: any): Observable<AuthenticationResponse> {
    return this.http
      .post(`${environment.apiBaseUrl}/reset-password`, { email })
      .pipe(map((response: ApiResponse) => response as AuthenticationResponse));
  }

  googleSignIn(credential: string): Observable<AuthenticationResponse> {
    return this.http
      .post(`${environment.apiBaseUrl}/auth/google`, { credential })
      .pipe(
        map((response: ApiResponse) => {
          console.log('Google sign-in response:', response);
          return response as AuthenticationResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('Google sign-in error:', error);
          const errorObj = {
            message: error.error?.msg || error.message || 'Erreur de connexion Google',
            status: error.status,
            error: error.error
          };
          return throwError(errorObj);
        })
      );
  }

  linkGoogleAccount(credential: string): Observable<any> {
    return this.http
      .post(`${environment.apiBaseUrl}/auth/link-google`, { credential })
      .pipe(
        map((response: ApiResponse) => response),
        catchError((error: HttpErrorResponse) => {
          console.log('Link Google account error:', error);
          const errorObj = {
            message: error.error?.msg || error.message || 'Erreur de liaison du compte Google',
            status: error.status,
            error: error.error
          };
          return throwError(errorObj);
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  me(): Observable<any> {
    return this.http
      .get(`${environment.apiBaseUrl}/me`)
      .pipe(map((response: ApiResponse) => response));
  }

  // eslint-disable-next-line max-lines-per-function
  loadValues(): Observable<Value[]> {
    const props = {
      input: {
        limit: null,
        page: null,
        orderBy: 'title',
        direction: 'ASC',
      },
      filter: {
        title: '',
        status: '',
      },
    };

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetValues($input: PaginationInput, $filter: ValueFilter) {
              getValues(input: $input, filter: $filter) {
                rows {
                  id
                  title
                  status
                }
              }
            }
          `,
          variables: props,
          fetchPolicy: 'network-only',
          context: {
            uri: `${environment.apiBaseUrl}/value`,
          },
        })
        .pipe(map((response) => response.data.getValues.rows))
    );
  }

  // eslint-disable-next-line max-lines-per-function, @typescript-eslint/no-explicit-any
  uploadMedia(file: any, type = 'image'): Observable<any> {
    const method = type === 'image' ? 'uploadImage' : 'uploadPdf';

    const mutation = gql`
      mutation ${method}($file: Upload!) {
        result: ${method}(input: $file) {
          id
        }
      }
    `;

    const formData = new FormData();
    formData.append(
      'operations',
      JSON.stringify({
        query: `
        mutation ${method}($file: Upload!) {
          result: ${method}(input: $file) {
            id
          }
        }
      `,
        variables: {
          file: null,
        },
      })
    );
    formData.append(
      'map',
      JSON.stringify({
        '0': ['variables.file'],
      })
    );
    formData.append('0', file);
    return this.http.post(`${environment.apiBaseUrl}/media`, formData);
  }
}
