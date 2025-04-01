import { Action, createReducer, on } from '@ngrx/store';
import { Article } from 'src/app/shared/models/article.interface';
import { Interview } from 'src/app/shared/models/interview.interface';
import {
  loadHrVoiceData,
  loadHrVoiceDataFail,
  loadHrVoiceDataSuccess,
} from '../actions/hr-voice.actions';

export interface HrVoiceState {
  news: Partial<Article>[];
  interview: Interview[];
  replay: Interview[];
  dataLoading: boolean;
  dataLoaded: boolean;
}

const initialState: HrVoiceState = {
  news: [],
  interview: [],
  replay: [],
  dataLoading: false,
  dataLoaded: false,
};

const loadHrVoiceDataReducer = (state: HrVoiceState): HrVoiceState => ({
  ...state,
  dataLoading: true,
  dataLoaded: false,
});

const loadHrVoiceDataFailReducer = (state: HrVoiceState): HrVoiceState => ({
  ...state,
  dataLoading: false,
  dataLoaded: false,
  news: undefined,
});

const loadHrVoiceDataSuccessReducer = (
  state: HrVoiceState,
  props: Partial<HrVoiceState>
): HrVoiceState => ({
  ...state,
  dataLoading: false,
  dataLoaded: true,
  ...props,
});

const reducer = createReducer(
  initialState,
  on(loadHrVoiceData, loadHrVoiceDataReducer),
  on(loadHrVoiceDataFail, loadHrVoiceDataFailReducer),
  on(loadHrVoiceDataSuccess, loadHrVoiceDataSuccessReducer)
);

export function hrVoiceReducer(
  state: HrVoiceState | undefined,
  action: Action
) {
  return reducer(state, action);
}
