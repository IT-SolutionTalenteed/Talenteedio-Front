import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { FreelanceListState } from '../reducers/freelance-list.reducers';
import { getFreelanceListCriteria } from '../selectors/freelance-list.selectors';
import * as FreelanceListActions from '../actions/freelance-list.actions';

@Injectable()
export class FreelanceListRouterEffects {
  navigateToFreelanceList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(() => this.router.url.includes('/freelance')),
      withLatestFrom(this.store.select(getFreelanceListCriteria)),
      map(([, criteria]) => FreelanceListActions.loadFreelanceJobs(criteria))
    )
  );

  loadInitialData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(() => this.router.url.includes('/freelance')),
      map(() => FreelanceListActions.loadJobTypes())
    )
  );

  loadJobCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(() => this.router.url.includes('/freelance')),
      map(() => FreelanceListActions.loadJobCategories())
    )
  );

  loadCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(() => this.router.url.includes('/freelance')),
      map(() => FreelanceListActions.loadCompanies())
    )
  );

  loadDidYouKnow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(() => this.router.url.includes('/freelance')),
      map(() => FreelanceListActions.loadDidYouKnow())
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<FreelanceListState>
  ) {}
}
