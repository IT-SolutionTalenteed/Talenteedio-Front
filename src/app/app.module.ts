/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { appRouterReducer } from './routeur/store/reducers/router.reducers';

import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from 'ngx-google-analytics';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication/services/authentication.service';
import { authenticationReducer } from './authentication/store/reducers/authentication.reducers';
import { GraphQLModule } from './graphql.module';
import { RouteurModule } from './routeur/routeur.module';
import { RequestInterceptor } from './shared/services/request.interceptor';
import { TransferHttpInterceptorService } from './shared/services/transfer-http.interceptor';
import { SharedModule } from './shared/shared.module';

registerLocaleData(localeFr);

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  if (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  ) {
    return localStorageSync({
      keys: [{ auth: ['user', 'refreshToken', 'token', 'userLoggedIn'] }],
      rehydrate: true,
    })(reducer);
  } else {
    return reducer;
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    RouteurModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(appRouterReducer, {
      metaReducers: [localStorageSyncReducer],
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    HttpClientModule,
    StoreModule.forFeature('auth', authenticationReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    FontAwesomeModule,
    GraphQLModule,
    NgxGoogleAnalyticsModule.forRoot(environment.googleAnalytics),
    NgxGoogleAnalyticsRouterModule,
    SharedModule,
  ],
  providers: [
    {
      provide: AuthenticationService,
      useClass: AuthenticationService,
    },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TransferHttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
