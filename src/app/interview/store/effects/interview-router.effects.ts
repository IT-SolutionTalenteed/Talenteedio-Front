import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter, map, withLatestFrom } from 'rxjs';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import {
  INTERVIEW_DEFAULT_CRITERIA,
  INTERVIEW_DETAIL_ROUTE_REGEX,
  INTERVIEW_LIST_BASE_ROUTE,
} from '../../constants/interview.constant';
import { InterviewListCriteria } from '../../types/interview-list-criteria.interface';
import { loadInterview, loadInterviews } from '../actions/interview.actions';
import { InterviewState } from '../reducers/interview.reducer';
import { getInterviewListCriteria } from '../selectors/interview.selector';

@Injectable()
export class InterviewRouterEffects {
  constructor(private action$: Actions, private store: Store<InterviewState>) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  interviewRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) =>
          urlWithoutQueryParams === INTERVIEW_LIST_BASE_ROUTE
      ),
      withLatestFrom(this.store.pipe(select(getInterviewListCriteria))),
      map(([routerState, criteriaFromStore]) =>
        loadInterviews(
          this.mergedCriteria(
            criteriaFromStore,
            INTERVIEW_DEFAULT_CRITERIA,
            routerState
          )
        )
      )
    )
  );

  interviewDetailRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter((routerState) =>
        INTERVIEW_DETAIL_ROUTE_REGEX.test(routerState.url)
      ),
      map((routerState) =>
        loadInterview({ id: routerState.params['interviewId'] })
      )
    )
  );

  private mergedCriteria(
    criteriaFromStore: InterviewListCriteria,
    defaultCriteria: InterviewListCriteria,
    routerState: AppRouterState
  ): InterviewListCriteria {
    return isEmpty(routerState.queryParams)
      ? criteriaFromStore // Use criteria from store
      : { ...defaultCriteria }; // or merge default criteria with queryParams if there is any
  }
}
