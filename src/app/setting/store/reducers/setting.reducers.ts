import { Action, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Setting } from 'src/app/shared/models/setting.interface';
import { EMPTY_SETTING_2 } from '../../constants/setting.constant';
import {
  loadSetting,
  loadSettingFail,
  loadSettingSuccess,
  saveSetting,
  saveSettingFail,
  saveSettingSuccess,
} from '../actions/setting.actions';

export interface SettingState {
  setting: Setting;
  settingSaving: boolean;
  settingSaved: boolean;
  saveSettingError: Error;
  settingLoading: boolean;
  settingLoaded: boolean;
  loadSettingError: Error;
}

const initialState: SettingState = {
  setting: cloneDeep(EMPTY_SETTING_2),
  settingSaving: false,
  settingSaved: false,
  saveSettingError: undefined,
  settingLoading: false,
  settingLoaded: false,
  loadSettingError: undefined,
};

const saveSettingReducer = (state: SettingState): SettingState => ({
  ...state,
  settingSaving: true,
  settingSaved: false,
});

const saveSettingSuccessReducer = (
  state: SettingState,
  props: Setting
): SettingState => ({
  ...state,
  settingSaving: false,
  settingSaved: true,
  setting: props,
  saveSettingError: undefined,
});

const saveSettingFailReducer = (
  state: SettingState,
  props: Error
): SettingState => ({
  ...state,
  settingSaving: false,
  settingSaved: true,
  saveSettingError: props,
});

const loadSettingReducer = (state: SettingState): SettingState => ({
  ...state,
  settingLoading: true,
  settingLoaded: false,
});

const loadSettingSuccessReducer = (
  state: SettingState,
  props: Setting
): SettingState => ({
  ...state,
  settingLoading: false,
  settingLoaded: true,
  setting: props,
});

const loadSettingFailReducer = (
  state: SettingState,
  props: Error
): SettingState => ({
  ...state,
  settingLoading: false,
  settingLoaded: false,
  loadSettingError: props,
});

const reducer = createReducer(
  initialState,
  on(saveSetting, saveSettingReducer),
  on(saveSettingSuccess, saveSettingSuccessReducer),
  on(saveSettingFail, saveSettingFailReducer),
  on(loadSetting, loadSettingReducer),
  on(loadSettingSuccess, loadSettingSuccessReducer),
  on(loadSettingFail, loadSettingFailReducer)
);

export function settingReducer(
  state: SettingState | undefined,
  action: Action
) {
  return reducer(state, action);
}
