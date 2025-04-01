import { Action, createReducer, on } from '@ngrx/store';
import { Article } from 'src/app/shared/models/article.interface';
import { Event } from 'src/app/shared/models/event.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import {
  loadCommunityData,
  loadCommunityDataFail,
  loadCommunityDataSuccess,
  loadHomeSetting,
  loadHomeSettingFail,
  loadHomeSettingSuccess,
} from '../actions/community.actions';

export interface CommunityState {
  news: Partial<Article>[];
  events: Partial<Event>[];
  eventsDates: Date[];
  dataLoading: boolean;
  dataLoaded: boolean;
  homeSetting: Partial<Setting>;
  homeSettingLoading: boolean;
  homeSettingLoaded: boolean;
}

const initialState: CommunityState = {
  news: [],
  eventsDates: [],
  events: [],
  dataLoading: false,
  dataLoaded: false,
  homeSetting: undefined,
  homeSettingLoading: false,
  homeSettingLoaded: false,
};

const loadCommunityDataReducer = (state: CommunityState): CommunityState => ({
  ...state,
  dataLoading: true,
  dataLoaded: false,
});

const loadCommunityDataFailReducer = (
  state: CommunityState
): CommunityState => ({
  ...state,
  dataLoading: false,
  dataLoaded: false,
  news: undefined,
});

const loadCommunityDataSuccessReducer = (
  state: CommunityState,
  props: Partial<CommunityState>
): CommunityState => ({
  ...state,
  dataLoading: false,
  dataLoaded: true,
  ...props,
});

const loadHomeSettingReducer = (state: CommunityState): CommunityState => ({
  ...state,
  homeSettingLoading: true,
  homeSettingLoaded: false,
});

const loadHomeSettingFailReducer = (state: CommunityState): CommunityState => ({
  ...state,
  homeSettingLoading: false,
  homeSettingLoaded: false,
});

const loadHomeSettingSuccessReducer = (
  state: CommunityState,
  props: Partial<Setting>
): CommunityState => ({
  ...state,
  homeSettingLoading: false,
  homeSettingLoaded: true,
  homeSetting: props,
});

const reducer = createReducer(
  initialState,
  on(loadCommunityData, loadCommunityDataReducer),
  on(loadCommunityDataFail, loadCommunityDataFailReducer),
  on(loadCommunityDataSuccess, loadCommunityDataSuccessReducer),
  on(loadHomeSetting, loadHomeSettingReducer),
  on(loadHomeSettingFail, loadHomeSettingFailReducer),
  on(loadHomeSettingSuccess, loadHomeSettingSuccessReducer)
);

export function communityReducer(
  state: CommunityState | undefined,
  action: Action
) {
  return reducer(state, action);
}
