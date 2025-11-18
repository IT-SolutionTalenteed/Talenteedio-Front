/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlatformServer } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  StateKey,
  TransferState,
  makeStateKey,
} from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransferHttpInterceptorService implements HttpInterceptor {
  isBroser = true;
  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      (request.method === 'GET' &&
        request.url === `${environment.apiBaseUrl}/me`) ||
      (request.method !== 'GET' && !request.body?.query)
    ) {
      return next.handle(request);
    } else if (request.body && !!request.body.operationName) {
      const _key = `${request.url}/${
        request.body.operationName
      }?${JSON.stringify(request.body.variables)}`;
      const key: StateKey<string> = makeStateKey<string>(_key);

      if (isPlatformServer(this.platformId)) {
        return next.handle(request).pipe(
          tap((event: any) => {
            this.transferState.set(key, event.body);
          })
        );
      } else {
        const storedResponse = this.transferState.get<any>(key, null);
        if (storedResponse) {
          const response = new HttpResponse({
            body: storedResponse,
            status: 200,
          });
          this.transferState.remove(key);
          return of(response);
        } else {
          return next.handle(request);
        }
      }
    } else {
      return next.handle(request);
    }
  }
}
