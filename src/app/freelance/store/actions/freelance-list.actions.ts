import { createAction, props } from '@ngrx/store';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { FreelanceListCriteria } from '../../types/freelance-list-criteria.interface';

export const loadFreelanceJobs = createAction(
  '[Freelance List] Load Freelance Jobs',
  props<FreelanceListCriteria>()
);

export const loadFreelanceJobsSuccess = createAction(
  '[Freelance List] Load Freelance Jobs Success',
  props<{ jobs: Job[]; totalItems: number }>()
);

export const loadFreelanceJobsFailure = createAction(
  '[Freelance List] Load Freelance Jobs Failure',
  props<{ error: any }>()
);

export const loadJobTypes = createAction('[Freelance List] Load Job Types');

export const loadJobTypesSuccess = createAction(
  '[Freelance List] Load Job Types Success',
  props<{ jobTypes: JobType[] }>()
);

export const loadJobTypesFailure = createAction(
  '[Freelance List] Load Job Types Failure',
  props<{ error: any }>()
);

export const loadJobCategories = createAction(
  '[Freelance List] Load Job Categories'
);

export const loadJobCategoriesSuccess = createAction(
  '[Freelance List] Load Job Categories Success',
  props<{ categories: Category[] }>()
);

export const loadJobCategoriesFailure = createAction(
  '[Freelance List] Load Job Categories Failure',
  props<{ error: any }>()
);

export const loadCompanies = createAction('[Freelance List] Load Companies');

export const loadCompaniesSuccess = createAction(
  '[Freelance List] Load Companies Success',
  props<{ companies: Company[] }>()
);

export const loadCompaniesFailure = createAction(
  '[Freelance List] Load Companies Failure',
  props<{ error: any }>()
);

export const loadDidYouKnow = createAction('[Freelance List] Load Did You Know');

export const loadDidYouKnowSuccess = createAction(
  '[Freelance List] Load Did You Know Success',
  props<{ didYouKnow: string }>()
);

export const loadDidYouKnowFailure = createAction(
  '[Freelance List] Load Did You Know Failure',
  props<{ error: any }>()
);
