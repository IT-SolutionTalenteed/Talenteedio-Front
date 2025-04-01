import { createAction, props } from '@ngrx/store';

export const loadPrivacy = createAction('[Privacy Policy] Load Privacy');

export const loadPrivacyFail = createAction(
  '[Privacy Policy] Load Privacy Fail',
  props<Error>()
);

export const loadPrivacySuccess = createAction(
  '[Privacy Policy] Load Privacy Success',
  props<{ privacy: string }>()
);
