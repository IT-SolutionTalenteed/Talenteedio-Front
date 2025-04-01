import { Action, createReducer, on } from '@ngrx/store';
import { Article } from 'src/app/shared/models/article.interface';
import { Event } from 'src/app/shared/models/event.interface';
import { Job } from 'src/app/shared/models/job.interface';
import {
  loadAdvisorData,
  loadAdvisorDataFail,
  loadAdvisorDataSuccess,
} from '../actions/advisor.actions';

export interface AdvisorState {
  news: Partial<Article>;
  popularJob: Partial<Job>;
  events: Partial<Event>[];
  eventsDates: Date[];
  totalJobs: number;
  totalEvents: number;
  totalUsers: number;
  dataLoading: boolean;
  dataLoaded: boolean;
}

const initialState: AdvisorState = {
  news: undefined,
  popularJob: undefined,
  eventsDates: [],
  events: [],
  totalJobs: 0,
  totalUsers: 0,
  totalEvents: 0,
  dataLoading: false,
  dataLoaded: false,
};

const loadAdvisorDataReducer = (state: AdvisorState): AdvisorState => ({
  ...state,
  dataLoading: true,
  dataLoaded: false,
});

const loadAdvisorDataFailReducer = (state: AdvisorState): AdvisorState => ({
  ...state,
  dataLoading: false,
  dataLoaded: false,
  news: undefined,
});

const loadAdvisorDataSuccessReducer = (
  state: AdvisorState,
  props: Partial<AdvisorState>
): AdvisorState => ({
  ...state,
  dataLoading: false,
  dataLoaded: true,
  ...props,
});

const reducer = createReducer(
  initialState,
  on(loadAdvisorData, loadAdvisorDataReducer),
  on(loadAdvisorDataFail, loadAdvisorDataFailReducer),
  on(loadAdvisorDataSuccess, loadAdvisorDataSuccessReducer)
);

export function advisorReducer(
  state: AdvisorState | undefined,
  action: Action
) {
  return reducer(state, action);
}
