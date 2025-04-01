import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import { TERMS_AND_CONDITIONS_BASE_ROUTE } from '../../constants/terms-and-conditions.constants';
import { loadTerms } from '../actions/terms-and-conditions.actions';
import { TermsAndConditionsState } from '../reducers/terms-and-conditions.reducers';

@Injectable()
export class TermsAndConditionsRouterEffects {
  constructor(
    private action$: Actions,
    private store: Store<TermsAndConditionsState>
  ) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  termsAndConditionsRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) =>
          urlWithoutQueryParams === TERMS_AND_CONDITIONS_BASE_ROUTE
      ),
      map(() => loadTerms())
    )
  );
}
