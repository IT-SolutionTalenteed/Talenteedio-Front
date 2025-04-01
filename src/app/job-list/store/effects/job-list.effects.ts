import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { Company } from 'src/app/shared/models/company.interface';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { JobListService } from '../../services/job-list.service';
import { JobListCriteria } from '../../types/job-list-criteria.interface';
import {
  loadCategories,
  loadCategoriesFail,
  loadCategoriesSuccess,
  loadCompanies,
  loadCompaniesFail,
  loadCompaniesSuccess,
  loadDidYouKnow,
  loadDidYouKnowFail,
  loadDidYouKnowSuccess,
  loadJobTypes,
  loadJobTypesFail,
  loadJobTypesSuccess,
  loadJobs,
  loadJobsFail,
  loadJobsSuccess,
} from '../actions/job-list.actions';
import { JobListState } from '../reducers/job-list.reducers';

@Injectable()
export class JobListEffects {
  constructor(
    private action$: Actions,
    private jobListService: JobListService,
    private store: Store<JobListState>
  ) {}

  loadJobs$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadJobs),
      switchMap((props: JobListCriteria) =>
        this.jobListService.loadJobs(props).pipe(
          map((response: Paginated<Job>) => loadJobsSuccess(response)),
          catchError((error) => of(loadJobsFail(error)))
        )
      )
    )
  );

  loadJobTypes$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadJobTypes),
      switchMap(() =>
        this.jobListService.loadJobTypes().pipe(
          map((response: JobType[]) =>
            loadJobTypesSuccess({ payload: response })
          ),
          catchError((error) => of(loadJobTypesFail(error)))
        )
      )
    )
  );

  loadJobCategories$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadCategories),
      switchMap(() =>
        this.jobListService.loadCategories().pipe(
          map((response: Category[]) =>
            loadCategoriesSuccess({ payload: response })
          ),
          catchError((error) => of(loadCategoriesFail(error)))
        )
      )
    )
  );

  loadCompanies$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadCompanies),
      switchMap(() =>
        this.jobListService.loadCompanies().pipe(
          map((response: Company[]) =>
            loadCompaniesSuccess({ payload: response })
          ),
          catchError((error) => of(loadCompaniesFail(error)))
        )
      )
    )
  );

  loadDidYouKnow$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadDidYouKnow),
      switchMap(() =>
        this.jobListService.loadDidYouKnow().pipe(
          map((response: string) =>
            loadDidYouKnowSuccess({ payload: response })
          ),
          catchError((error) => of(loadDidYouKnowFail(error)))
        )
      )
    )
  );
}
