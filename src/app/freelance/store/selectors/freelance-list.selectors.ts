import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FreelanceListState } from '../reducers/freelance-list.reducers';

export const selectFreelanceListState =
  createFeatureSelector<FreelanceListState>('freelanceList');

export const getFreelanceJobs = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.jobs
);

export const getJobTypes = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.jobTypes
);

export const getJobCategories = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.categories
);

export const getFreelanceJobsLoading = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.jobsLoading
);

export const getFreelanceJobsTotalItems = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.totalItems
);

export const getFreelanceListCriteria = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.criteria
);

export const getCompanies = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.companies
);

export const getCompaniesLoading = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.companiesLoading
);

export const getDidYouKnow = createSelector(
  selectFreelanceListState,
  (state: FreelanceListState) => state.didYouKnow
);
