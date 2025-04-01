import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdvisorState } from '../reducers/advisor.reducers';

export const getBlogState = createFeatureSelector<AdvisorState>('advisor');

export const getNews = createSelector(
  getBlogState,
  (state: AdvisorState) => state.news
);

export const getPopularJob = createSelector(
  getBlogState,
  (state: AdvisorState) => state.popularJob
);

export const getTotalJobs = createSelector(
  getBlogState,
  (state: AdvisorState) => state.totalJobs
);

export const getEvents = createSelector(
  getBlogState,
  (state: AdvisorState) => state.events
);

export const getTotalEvents = createSelector(
  getBlogState,
  (state: AdvisorState) => state.totalEvents
);

export const getTotalUsers = createSelector(
  getBlogState,
  (state: AdvisorState) => state.totalUsers
);

export const getAdvisorDataLoading = createSelector(
  getBlogState,
  (state: AdvisorState) => state.dataLoading
);

export const getEventsDates = createSelector(
  getBlogState,
  (state: AdvisorState) => state.eventsDates
);
