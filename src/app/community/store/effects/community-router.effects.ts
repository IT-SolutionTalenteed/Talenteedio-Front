import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { filter, map, mergeMap } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import { COMMUNITY_ROUTE } from '../../constants/community.constants';
import {
  loadCommunityData,
  loadHomeSetting,
} from '../actions/community.actions';

@Injectable()
export class CommunityRouterEffects {
  constructor(private action$: Actions) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  homeRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) => urlWithoutQueryParams === COMMUNITY_ROUTE
      ),
      mergeMap(() => [loadCommunityData(), loadHomeSetting()])
    )
  );
}
