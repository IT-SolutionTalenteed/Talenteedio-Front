import { createAction, props } from '@ngrx/store';
import { HrVoiceState } from '../reducers/hr-voice.reducers';

export const loadHrVoiceData = createAction('[HrVoice] Load Data');

export const loadHrVoiceDataSuccess = createAction(
  '[HrVoice] Load Data Success',
  props<Partial<HrVoiceState>>()
);

export const loadHrVoiceDataFail = createAction(
  '[HrVoice] Load Data Fail',
  props<Error>()
);
