/* eslint-disable max-lines-per-function */
import { isPlatformBrowser } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import {
  refreshTokenFailed,
  refreshTokenSuccess,
} from 'src/app/authentication/store/actions/authentication.actions';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getRefreshToken } from 'src/app/authentication/store/selectors/authentication.selectors';
import { AuthenticationResponse } from 'src/app/authentication/types/authentication-response.interface';
import { tokenGetter } from 'src/app/authentication/utils/token-getter';
import { environment } from 'src/environments/environment';
import { verifyFailed } from 'src/app/authentication/store/actions/authentication.actions';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private authenticationStore: Store<AuthenticationState>,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {}
  private tosterOption: Partial<IndividualConfig<unknown>> = {
    progressBar: true,
    closeButton: true,
    progressAnimation: 'increasing',
  };
  // eslint-disable-next-line max-lines-per-function
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (isPlatformBrowser(this.platformId)) {
      return next
        .handle(
          this.addBearerToken(request, tokenGetter()).clone({
            withCredentials: true,
          })
        )
        .pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tap((response: any) => {
            if (response instanceof HttpResponse) {
              // this.toastr.success(response.body?.msg || '', 'Success', this.tosterOption);
            }
            let expiredToken = false;
            response?.body?.errors?.forEach((error) => {
              if (error?.extensions?.statusCode !== 401) {
                this.toastr.error(
                  error.message || '',
                  'Error',
                  this.tosterOption
                );
              }
              if (error?.extensions?.statusCode === 401) {
                expiredToken = true;
              }
            });
            if (expiredToken) {
              // Emit a 401 to trigger refresh flow without throwing a generic error
              throw new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
            }
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 498) {
              const errorMsg = error.error?.msg || error.error?.message || error.message || 'Token expired';
              this.toastr.error(errorMsg, 'Error', this.tosterOption);
              return throwError(error);
            }
            if (error.status === 401 || error.message === 'Invalid token') {
              // If calling /me and unauthorized, redirect to home immediately
              const isMeEndpoint =
                request.method === 'GET' &&
                (request.url === `${environment.apiBaseUrl}/me` ||
                  request.url.endsWith('/me'));
              return this.authenticationStore.pipe(
                select(getRefreshToken),
                switchMap((token: string) => {
                  if (!token) {
                    // No refresh token available
                    if (isMeEndpoint) {
                      // Clear local auth and redirect to home
                      this.authenticationStore.dispatch(
                        verifyFailed(new Error('session invalid'))
                      );
                      this.router.navigate(['/home']);
                    }
                    // End the stream silently
                    return EMPTY;
                  }
                  return this.authenticationService.refreshToken(token).pipe(
                    tap((response: AuthenticationResponse) => {
                      this.authenticationStore.dispatch(
                        refreshTokenSuccess(response)
                      );
                    }),
                    // eslint-disable-next-line max-len
                    switchMap((response: AuthenticationResponse) =>
                      next.handle(
                        this.addBearerToken(
                          request,
                          response.accessToken
                        ).clone({ withCredentials: true })
                      )
                    ),
                    catchError((errorRefresh) => {
                      this.authenticationStore.dispatch(
                        refreshTokenFailed(errorRefresh)
                      );
                      const errorMsg = error.error?.msg || error.error?.message || error.message || 'Session expired';
                      this.toastr.error(
                        errorMsg,
                        'Error',
                        this.tosterOption
                      );
                      // If refresh also failed and original call was /me, redirect home
                      if (isMeEndpoint) {
                        this.authenticationStore.dispatch(
                          verifyFailed(new Error('session invalid'))
                        );
                        this.router.navigate(['/home']);
                      }
                      return throwError(error);
                    })
                  );
                })
              );
            }
            const errorMsg = error.error?.msg || error.error?.message || error.message || 'An error occurred';
            this.toastr.error(errorMsg, 'Error', this.tosterOption);
            return throwError(error);
          })
        );
    } else {
      // Handle server-side rendering (SSR) here, if required
      return next.handle(request);
    }
  }

  private addBearerToken(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    let req = request;
    if (token) {
      req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // add the bearer token to the request headers
        },
      });
    }
    return req;
  }
}
