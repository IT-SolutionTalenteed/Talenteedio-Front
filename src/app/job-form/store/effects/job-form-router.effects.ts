import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs';
import { getIsUserTalent } from 'src/app/authentication/store/selectors/authentication.selectors';
import { navigationLaunched } from 'src/app/routeur/store/actions/router.actions';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import { JOB_DETAIL_ROUTE_REGEX } from '../../constants/job-form.constant';
import { loadApplyJobCriteria, loadJob } from '../actions/job-form.actions';
import { JobFormState } from '../reducers/job-form.reducers';

@Injectable()
export class JobFormRouterEffects {
  constructor(private action$: Actions, private store: Store<JobFormState>) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  jobFormDetailRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter((routerState) => JOB_DETAIL_ROUTE_REGEX.test(routerState.url)),
      withLatestFrom(this.store.pipe(select(getIsUserTalent))),
      mergeMap(([routerState, isUserTalent]) => [
        loadJob({ id: routerState.params['jobId'] }),
        isUserTalent ? loadApplyJobCriteria() : navigationLaunched(),
      ])
    )
  );
}
