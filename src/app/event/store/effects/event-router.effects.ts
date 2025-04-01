import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter, map, withLatestFrom } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import {
  EVENT_DEFAULT_CRITERIA,
  EVENT_DETAIL_ROUTE_REGEX,
  EVENT_LIST_BASE_ROUTE,
} from '../../constants/event.constant';
import { EventListCriteria } from '../../types/event-list-criteria.interface';
import { loadEvent, loadEvents } from '../actions/event.actions';
import { EventState } from '../reducers/event.reducers';
import { getEventListCriteria } from '../selectors/event.selectors';

@Injectable()
export class EventRouterEffects {
  constructor(private action$: Actions, private store: Store<EventState>) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  eventRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) =>
          urlWithoutQueryParams === EVENT_LIST_BASE_ROUTE
      ),
      withLatestFrom(this.store.pipe(select(getEventListCriteria))),
      map(([routerState, criteriaFromStore]) =>
        loadEvents(
          this.mergedCriteria(
            criteriaFromStore,
            EVENT_DEFAULT_CRITERIA,
            routerState
          )
        )
      )
    )
  );

  eventDetailRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter((routerState) => EVENT_DETAIL_ROUTE_REGEX.test(routerState.url)),
      map((routerState) => loadEvent({ id: routerState.params['eventId'] }))
    )
  );

  private mergedCriteria(
    criteriaFromStore: EventListCriteria,
    defaultCriteria: EventListCriteria,
    routerState: AppRouterState
  ): EventListCriteria {
    return isEmpty(routerState.queryParams)
      ? criteriaFromStore // Use criteria from store
      : { ...defaultCriteria }; // or merge default criteria with queryParams if there is any
  }
}
