import { createAction, props } from '@ngrx/store';
import { Company } from 'src/app/shared/models/company.interface';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { JobListCriteria } from '../../types/job-list-criteria.interface';

export const loadJobs = createAction(
  '[JobList] Load Jobs',
  props<JobListCriteria>()
);

export const loadJobsFail = createAction(
  '[JobList] Load Jobs Fail',
  props<Error>()
);

export const loadJobsSuccess = createAction(
  '[JobList] Load Jobs Success',
  props<Paginated<Job>>()
);

export const loadJobTypes = createAction('[JobList] Load JobTypes');

export const loadJobTypesFail = createAction(
  '[JobList] Load JobTypes Fail',
  props<Error>()
);

export const loadJobTypesSuccess = createAction(
  '[JobList] Load JobTypes Success',
  props<{ payload: JobType[] }>()
);

export const loadCategories = createAction('[JobList] Load Categories');

export const loadCategoriesFail = createAction(
  '[JobList] Load Categories Fail',
  props<Error>()
);

export const loadCategoriesSuccess = createAction(
  '[JobList] Load Categories Success',
  props<{ payload: Category[] }>()
);

export const loadCompanies = createAction('[Home] Load Companies');

export const loadCompaniesFail = createAction(
  '[Home] Load Companies Fail',
  props<Error>()
);

export const loadCompaniesSuccess = createAction(
  '[Home] Load Companies Success',
  props<{ payload: Company[] }>()
);

export const loadDidYouKnow = createAction('[Home] Load DidYouKnow');

export const loadDidYouKnowFail = createAction(
  '[Home] Load DidYouKnow Fail',
  props<Error>()
);

export const loadDidYouKnowSuccess = createAction(
  '[Home] Load DidYouKnow Success',
  props<{ payload: string }>()
);
