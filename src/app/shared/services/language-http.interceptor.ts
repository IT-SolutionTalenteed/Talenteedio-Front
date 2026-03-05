import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageHttpInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip adding language header for translation file requests to avoid circular dependency
    if (request.url.includes('/assets/i18n/')) {
      return next.handle(request);
    }

    // Get current language from localStorage to avoid circular dependency
    let currentLang = 'fr'; // default
    
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedLang = localStorage.getItem('language');
      if (storedLang) {
        currentLang = storedLang;
      }
    }
    
    // Clone the request and add Accept-Language header
    const clonedRequest = request.clone({
      setHeaders: {
        'Accept-Language': currentLang
      }
    });

    return next.handle(clonedRequest);
  }
}
