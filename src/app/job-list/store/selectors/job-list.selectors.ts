import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Job } from 'src/app/shared/models/job.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { JobListState } from '../reducers/job-list.reducers';

export const getJobListState = createFeatureSelector<JobListState>('jobList');

export const getPaginatedJobs = createSelector(
  getJobListState,
  (state: JobListState) => state.jobs
);

export const getJobs = createSelector(
  getPaginatedJobs,
  (paginatedJob: Paginated<Job>) => paginatedJob.items
);

export const getJobListCriteria = createSelector(
  getJobListState,
  (state: JobListState) => state.jobListCriteria
);

export const getJobsLoading = createSelector(
  getJobListState,
  (state: JobListState) => state.jobsLoading
);

export const getJobsTotalItems = createSelector(
  getPaginatedJobs,
  (paginatedJobs: Paginated<Job>) => paginatedJobs.totalItems
);

export const getJobTypes = createSelector(
  getJobListState,
  (state: JobListState) => state.jobTypes
);

export const getJobCategories = createSelector(
  getJobListState,
  (state: JobListState) => state.categories
);

export const getCompanies = createSelector(
  getJobListState,
  (state: JobListState) => state.companies
);

export const getCompaniesLoading = createSelector(
  getJobListState,
  (state: JobListState) => state.companiesLoading
);

export const getDidYouKnow = createSelector(
  getJobListState,
  (state: JobListState) => state.didYouKnow
);
