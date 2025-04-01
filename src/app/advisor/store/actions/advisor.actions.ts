import { createAction, props } from '@ngrx/store';
import { AdvisorState } from '../reducers/advisor.reducers';

export const loadAdvisorData = createAction('[Advisor] Load Data');

export const loadAdvisorDataSuccess = createAction(
  '[Advisor] Load Data Success',
  props<Partial<AdvisorState>>()
);

export const loadAdvisorDataFail = createAction(
  '[Advisor] Load Data Fail',
  props<Error>()
);
