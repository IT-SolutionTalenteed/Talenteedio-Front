import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { filter, map } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import { ADVISOR_ROUTE } from '../../constants/advisor.constants';
import { loadAdvisorData } from '../actions/advisor.actions';

@Injectable()
export class AdvisorRouterEffects {
  constructor(private action$: Actions) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  homeRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) => urlWithoutQueryParams === ADVISOR_ROUTE
      ),
      map(() => loadAdvisorData())
    )
  );
}
