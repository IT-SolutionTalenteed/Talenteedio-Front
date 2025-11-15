import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { filter, map, mergeMap } from 'rxjs';
import { SIGN_UP_ROUTE } from '../../constants/authentication.constant';
import { loadValues } from '../actions/authentication.actions';
import { AppRouterState } from './../../../routeur/store/reducers/router.reducers';

@Injectable()
export class AuthenticationRouterEffects {
  constructor(private action$: Actions) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  authenticationRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(({ urlWithoutQueryParams }) =>
        [SIGN_UP_ROUTE, '/authentication/sign-up-choice'].includes(
          urlWithoutQueryParams
        )
      ),
      mergeMap(() => [loadValues()])
    )
  );
}
