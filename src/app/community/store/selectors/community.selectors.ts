import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommunityState } from '../reducers/community.reducers';

export const getBlogState = createFeatureSelector<CommunityState>('community');

export const getNews = createSelector(
  getBlogState,
  (state: CommunityState) => state.news
);

export const getEvents = createSelector(
  getBlogState,
  (state: CommunityState) => state.events
);

export const getCommunityDataLoading = createSelector(
  getBlogState,
  (state: CommunityState) => state.dataLoading
);

export const getEventsDates = createSelector(
  getBlogState,
  (state: CommunityState) => state.eventsDates
);

export const getHomeSettingLoading = createSelector(
  getBlogState,
  (state: CommunityState) => state.homeSettingLoading
);

export const getHomeSetting = createSelector(
  getBlogState,
  (state: CommunityState) => state.homeSetting
);
