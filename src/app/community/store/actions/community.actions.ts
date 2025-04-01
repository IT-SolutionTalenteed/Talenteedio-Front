import { createAction, props } from '@ngrx/store';
import { Setting } from 'src/app/shared/models/setting.interface';
import { CommunityState } from '../reducers/community.reducers';

export const loadCommunityData = createAction('[Community] Load Data');

export const loadCommunityDataSuccess = createAction(
  '[Community] Load Data Success',
  props<Partial<CommunityState>>()
);

export const loadCommunityDataFail = createAction(
  '[Community] Load Data Fail',
  props<Error>()
);

export const loadHomeSetting = createAction('[Home] Load Home Setting');

export const loadHomeSettingFail = createAction(
  '[Home] Load Home Setting Fail',
  props<Error>()
);

export const loadHomeSettingSuccess = createAction(
  '[Home] Load Home Setting Success',
  props<Partial<Setting>>()
);
