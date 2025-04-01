import { createAction, props } from '@ngrx/store';
import { Job } from 'src/app/shared/models/job.interface';
import { UserDocument } from 'src/app/shared/models/user-document';
import { JobApplyCriteria } from '../../types/job-apply-criteria';
import { JobReferCriteria } from '../../types/job-refer-criteria';

export const loadJob = createAction(
  '[Job Form] Load Job',
  props<{ id: string }>()
);

export const loadJobSuccess = createAction(
  '[Job Form] Load Job Success',
  props<Job>()
);

export const loadJobFail = createAction(
  '[Job Form] Load Job Fail',
  props<Error>()
);

export const loadApplyJobCriteria = createAction(
  '[Job Form] Load Apply Job Criteria'
);

export const loadApplyJobCriteriaSuccess = createAction(
  '[Job Form] Load Apply Job Criteria Success',
  props<{ CVs: UserDocument[]; LMs: UserDocument[] }>()
);

export const loadApplyJobCriteriaFail = createAction(
  '[Job Form] Load Apply Job Criteria Fail',
  props<Error>()
);

export const applyForJob = createAction(
  '[Job Form] Apply for Job',
  props<JobApplyCriteria>()
);

export const applyForJobSuccess = createAction(
  '[Job Form] Apply for Job Success'
);

export const applyForJobFail = createAction(
  '[Job Form] Apply for Job Fail',
  props<Error>()
);

export const referJob = createAction(
  '[Job Form] Refer Job',
  props<JobReferCriteria>()
);

export const referJobSuccess = createAction('[Job Form] Refer Job Success');

export const referJobFail = createAction(
  '[Job Form] Refer Job Fail',
  props<Error>()
);
