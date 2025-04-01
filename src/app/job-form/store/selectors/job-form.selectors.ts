import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobFormState } from '../reducers/job-form.reducers';

export const getJobFormState = createFeatureSelector<JobFormState>('jobForm');

export const getJob = createSelector(
  getJobFormState,
  (state: JobFormState) => state.job
);

export const getJobLoading = createSelector(
  getJobFormState,
  (state: JobFormState) => state.jobLoading
);

export const getCVs = createSelector(
  getJobFormState,
  (state: JobFormState) => state.CVs
);
export const getLMs = createSelector(
  getJobFormState,
  (state: JobFormState) => state.LMs
);

export const getApplyForJobLoading = createSelector(
  getJobFormState,
  (state: JobFormState) => state.applyForJobLoading
);

export const getApplyForJobLoaded = createSelector(
  getJobFormState,
  (state: JobFormState) => state.applyForJobLoaded
);

export const getApplyForJobError = createSelector(
  getJobFormState,
  (state: JobFormState) => state?.applyForJobError
);

export const getApplyForJobErrorMessage = createSelector(
  getApplyForJobError,
  (jobApplyError: Error) => jobApplyError?.message ?? ''
);

export const getReferJobLoading = createSelector(
  getJobFormState,
  (state: JobFormState) => state.referJobLoading
);

export const getReferJobLoaded = createSelector(
  getJobFormState,
  (state: JobFormState) => state.referJobLoaded
);

export const getReferJobError = createSelector(
  getJobFormState,
  (state: JobFormState) => state?.referJobError
);

export const getReferJobErrorMessage = createSelector(
  getReferJobError,
  (jobReferError: Error) => jobReferError?.message ?? ''
);
