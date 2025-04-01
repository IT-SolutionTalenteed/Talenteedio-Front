import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs';
import {
  EMPTY_JOB_FILTER,
  JOB_LIST_BASE_ROUTE,
  JOB_LIST_DEFAULT_CRITERIA,
} from '../../constants/job-list.constant';
import { JobListCriteria } from '../../types/job-list-criteria.interface';
import {
  loadCategories,
  loadCompanies,
  loadDidYouKnow,
  loadJobTypes,
  loadJobs,
} from '../actions/job-list.actions';
import { JobListState } from '../reducers/job-list.reducers';
import { getJobListCriteria } from '../selectors/job-list.selectors';
import { AppRouterState } from './../../../routeur/store/reducers/router.reducers';

@Injectable()
export class JobListRouterEffects {
  constructor(private action$: Actions, private store: Store<JobListState>) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  jobListListRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) =>
          urlWithoutQueryParams === JOB_LIST_BASE_ROUTE
      ),
      withLatestFrom(this.store.pipe(select(getJobListCriteria))),
      mergeMap(([routerState, criteriaFromStore]) => [
        loadJobs(
          this.mergedCriteria(
            criteriaFromStore,
            JOB_LIST_DEFAULT_CRITERIA,
            routerState
          )
        ),

        loadJobTypes(),
        loadJobTypes(),
        loadCategories(),
        loadCompanies(),
        loadDidYouKnow(),
      ])
    )
  );

  private mergedCriteria(
    criteriaFromStore: JobListCriteria,
    defaultCriteria: JobListCriteria,
    routerState: AppRouterState
  ): JobListCriteria {
    return isEmpty(routerState.queryParams)
      ? criteriaFromStore // Use criteria from store
      : {
          ...criteriaFromStore,
          filter: { ...EMPTY_JOB_FILTER, ...routerState.queryParams },
        }; // or merge default criteria with queryParams if there is any
  }
}
