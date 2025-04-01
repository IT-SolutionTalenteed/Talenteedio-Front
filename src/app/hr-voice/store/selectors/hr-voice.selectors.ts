import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HrVoiceState } from '../reducers/hr-voice.reducers';

export const getBlogState = createFeatureSelector<HrVoiceState>('hrVoice');

export const getNews = createSelector(
  getBlogState,
  (state: HrVoiceState) => state.news
);

export const getInterview = createSelector(
  getBlogState,
  (state: HrVoiceState) => state.interview
);

export const getReplay = createSelector(
  getBlogState,
  (state: HrVoiceState) => state.replay
);

export const getHrVoiceDataLoading = createSelector(
  getBlogState,
  (state: HrVoiceState) => state.dataLoading
);
