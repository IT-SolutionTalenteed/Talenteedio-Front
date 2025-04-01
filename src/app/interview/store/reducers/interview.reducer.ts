import { cloneDeep } from '@apollo/client/utilities';
import { Action, createReducer, on } from '@ngrx/store';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { INTERVIEW_DEFAULT_CRITERIA } from '../../constants/interview.constant';
import { InterviewListCriteria } from '../../types/interview-list-criteria.interface';
import {
  loadInterview,
  loadInterviewFail,
  loadInterviewSuccess,
  loadInterviews,
  loadInterviewsFail,
  loadInterviewsSuccess,
} from '../actions/interview.actions';

export interface InterviewState {
  interviews: Paginated<Interview>;
  interviewsLoading: boolean;
  interviewsLoaded: boolean;
  interviewListCriteria: InterviewListCriteria;
  interview: Interview;
  interviewLoading: boolean;
  interviewLoaded: boolean;
}

const initialState: InterviewState = {
  interviews: { items: [], totalItems: 0 },
  interviewsLoading: false,
  interviewsLoaded: false,
  interviewListCriteria: cloneDeep(INTERVIEW_DEFAULT_CRITERIA),
  interview: undefined,
  interviewLoading: false,
  interviewLoaded: false,
};

const loadInterviewsReducer = (
  state: InterviewState,
  props: InterviewListCriteria
): InterviewState => ({
  ...state,
  interviewsLoading: true,
  interviewsLoaded: false,
  interviewListCriteria: props,
});

const loadInterviewsFailReducer = (state: InterviewState): InterviewState => ({
  ...state,
  interviewsLoaded: false,
  interviewsLoading: false,
});

const loadInterviewsSuccesReducer = (
  state: InterviewState,
  props: Paginated<Interview>
): InterviewState => ({
  ...state,
  interviewsLoaded: true,
  interviewsLoading: false,
  interviews: props,
});

const loadInterviewReducer = (state: InterviewState): InterviewState => ({
  ...state,
  interviewLoading: true,
  interviewLoaded: false,
});

const loadInterviewFailReducer = (state: InterviewState): InterviewState => ({
  ...state,
  interviewLoading: false,
  interviewLoaded: false,
  interview: undefined,
});

const loadInterviewSuccessReducer = (
  state: InterviewState,
  props: Interview
): InterviewState => ({
  ...state,
  interviewLoading: false,
  interviewLoaded: true,
  interview: props,
});

const reducer = createReducer(
  initialState,
  on(loadInterviews, loadInterviewsReducer),
  on(loadInterviewsFail, loadInterviewsFailReducer),
  on(loadInterviewsSuccess, loadInterviewsSuccesReducer),
  on(loadInterview, loadInterviewReducer),
  on(loadInterviewFail, loadInterviewFailReducer),
  on(loadInterviewSuccess, loadInterviewSuccessReducer)
);

export function interviewReducer(
  state: InterviewState | undefined,
  action: Action
) {
  return reducer(state, action);
}
