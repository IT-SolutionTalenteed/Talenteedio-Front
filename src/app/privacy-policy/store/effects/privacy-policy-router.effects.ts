import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import { PRIVACY_POLICY_BASE_ROUTE } from '../../constants/privacy.constants';
import { loadPrivacy } from '../actions/privacy-policy.actions';
import { PrivacyPolicyState } from '../reducers/privacy-policy.reducers';

@Injectable()
export class PrivacyPolicyRouterEffects {
  constructor(
    private action$: Actions,
    private store: Store<PrivacyPolicyState>
  ) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  privacyRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) =>
          urlWithoutQueryParams === PRIVACY_POLICY_BASE_ROUTE
      ),
      map(() => loadPrivacy())
    )
  );
}
