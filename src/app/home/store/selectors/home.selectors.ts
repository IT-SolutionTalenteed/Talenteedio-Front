import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeState } from '../reducers/home.reducers';

export const getHomeState = createFeatureSelector<HomeState>('home');

export const getJobs = createSelector(
  getHomeState,
  (state: HomeState) => state.jobs
);

export const getJobsLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.jobsLoading
);

export const getArticles = createSelector(
  getHomeState,
  (state: HomeState) => state.articles
);

export const getArticlesLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.articlesLoading
);

export const getInterview = createSelector(
  getHomeState,
  (state: HomeState) => state.interview
);

export const getInterviewLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.interviewLoading
);

export const getTestimonials = createSelector(
  getHomeState,
  (state: HomeState) => state.testimonials
);

export const getTestimonialsLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.testimonialsLoading
);

export const getHomeSettingLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.homeSettingLoading
);

export const getHomeSetting = createSelector(
  getHomeState,
  (state: HomeState) => state.homeSetting
);

export const getPartners = createSelector(
  getHomeState,
  (state: HomeState) => state.partners
);

export const getPartnersLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.partnersLoading
);

export const getCompanies = createSelector(
  getHomeState,
  (state: HomeState) => state.companies
);

export const getCompaniesLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.companiesLoading
);

export const getUpcomingEvents = createSelector(
  getHomeState,
  (state: HomeState) => state.upcomingEvents
);

export const getUpcomingEventsLoading = createSelector(
  getHomeState,
  (state: HomeState) => state.upcomingEventsLoading
);
