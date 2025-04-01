import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingState } from '../reducers/setting.reducers';

export const getSettingState =
  createFeatureSelector<SettingState>('setting');

export const getSettingSaving = createSelector(
    getSettingState,
    (state: SettingState) => state.settingSaving
);

export const getSaveSettingError = createSelector(
    getSettingState,
    (state: SettingState) => state.saveSettingError
);

export const getSetting = createSelector(getSettingState, (state: SettingState) => state.setting);

export const getSettingLoading = createSelector(
    getSettingState,
    (state: SettingState) => state.settingLoading
);

export const getSettingFormLoading = createSelector(
    getSettingLoading,
    getSettingSaving,
    (loading: boolean, saving: boolean) => loading || saving
);
