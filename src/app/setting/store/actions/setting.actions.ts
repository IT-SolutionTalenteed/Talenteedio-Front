import { createAction, props } from '@ngrx/store';
import { Setting } from 'src/app/shared/models/setting.interface';

export const saveSetting = createAction('[Setting] Save Setting', props<{ payload: Setting }>());

export const saveSettingSuccess = createAction(
    '[Setting] Save Setting Success',
    props<Setting>()
);

export const saveSettingFail = createAction('[Setting] Save Setting Fail', props<Error>());

export const loadSetting = createAction('[Setting] Load Setting');

export const loadSettingSuccess = createAction('[Setting] Load Setting Success', props<Setting>());

export const loadSettingFail = createAction('[Setting] Load Setting Fail', props<Error>());
