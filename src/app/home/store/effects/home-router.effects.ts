import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import { HOME_ROUTE } from '../../constants/home.constant';
import {
  loadArticles,
  loadHomeSetting,
  loadInterview,
  loadJobs,
  loadPartners,
} from '../actions/home.actions';
import { HomeState } from '../reducers/home.reducers';

@Injectable()
export class HomeRouterEffects {
  constructor(private action$: Actions, private store: Store<HomeState>) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  homeRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) => urlWithoutQueryParams === HOME_ROUTE
      ),
      mergeMap(() => [
        loadJobs(),
        loadHomeSetting(),
        loadPartners(),
        loadArticles(),
        loadInterview(),
      ])
    )
  );
}
