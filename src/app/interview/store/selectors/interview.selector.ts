import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InterviewState } from '../reducers/interview.reducer';

export const getInterviewState =
  createFeatureSelector<InterviewState>('interview');

export const getPaginatedInterviews = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interviews
);

export const getInterviews = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interviews.items
);
export const getInterviewsTotalItems = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interviews.totalItems
);

export const getInterviewListCriteria = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interviewListCriteria
);

export const getInterviewsLoading = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interviewsLoading
);

export const getInterview = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interview
);

export const getInterviewLoaded = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interviewLoaded
);

export const getInterviewLoading = createSelector(
  getInterviewState,
  (state: InterviewState) => state.interviewLoading
);
