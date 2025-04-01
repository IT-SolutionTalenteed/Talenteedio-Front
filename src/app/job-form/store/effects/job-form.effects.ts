import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import {
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { JOB_LIST_BASE_ROUTE } from 'src/app/job-list/constants/job-list.constant';
import {
  go,
  navigationLaunched,
  showSuccess,
} from 'src/app/routeur/store/actions/router.actions';
import { Job } from 'src/app/shared/models/job.interface';
import { UserDocument } from 'src/app/shared/models/user-document';
import { JobFormService } from '../../services/job-form.service';
import { JobApplyCriteria } from '../../types/job-apply-criteria';
import { JobReferCriteria } from '../../types/job-refer-criteria';
import {
  applyForJob,
  applyForJobFail,
  applyForJobSuccess,
  loadApplyJobCriteria,
  loadApplyJobCriteriaFail,
  loadApplyJobCriteriaSuccess,
  loadJob,
  loadJobFail,
  loadJobSuccess,
  referJob,
  referJobFail,
  referJobSuccess,
} from '../actions/job-form.actions';
import { JobFormState } from '../reducers/job-form.reducers';
import { getJob } from '../selectors/job-form.selectors';

@Injectable()
export class JobFormEffects {
  // eslint-disable-next-line max-params
  constructor(
    private action$: Actions,
    private jobFormService: JobFormService,
    private jobFormStore: Store<JobFormState>,
    private authenticationStore: Store<AuthenticationState>,
    private gaService: GoogleAnalyticsService
  ) {}

  loadJob$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadJob),
      switchMap((props: { id: string }) =>
        this.jobFormService.loadJob(props.id).pipe(
          map((response: Job) => loadJobSuccess(response)),
          catchError((error) => of(loadJobFail(error)))
        )
      )
    )
  );

  loadApplyJobCriteria$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadApplyJobCriteria),
      switchMap(() =>
        this.jobFormService.loadApplyJobCriteria().pipe(
          map((response: { CVs: UserDocument[]; LMs: UserDocument[] }) =>
            loadApplyJobCriteriaSuccess(response)
          ),
          catchError((error) => of(loadApplyJobCriteriaFail(error)))
        )
      )
    )
  );

  applyForJob$ = createEffect(() =>
    this.action$.pipe(
      ofType(applyForJob),
      switchMap((props: JobApplyCriteria) =>
        this.jobFormService.applyForJob(props).pipe(
          mergeMap(() => [
            showSuccess({ message: 'Job applied for' }),
            applyForJobSuccess(),
            go({ path: [JOB_LIST_BASE_ROUTE] }),
          ]),
          catchError((error) => of(applyForJobFail(error)))
        )
      )
    )
  );

  referJob$ = createEffect(() =>
    this.action$.pipe(
      ofType(referJob),
      switchMap((props: JobReferCriteria) =>
        this.jobFormService.referJob(props).pipe(
          mergeMap(() => [
            showSuccess({ message: 'Successful job recommendation' }),
            referJobSuccess(),
            go({ path: [JOB_LIST_BASE_ROUTE] }),
          ]),
          catchError((error) => of(referJobFail(error)))
        )
      )
    )
  );

  applyForJobSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(applyForJobSuccess),
      withLatestFrom(
        this.authenticationStore.select(getLoggedUser),
        this.jobFormStore.select(getJob)
      ),
      tap(([action, user, job]) => {
        this.gaService.event('apply', 'job', `${job.title}_${user.email}`);
      }),
      map(() => navigationLaunched())
    )
  );
}
