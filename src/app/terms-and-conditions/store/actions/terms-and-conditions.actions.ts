import { createAction, props } from '@ngrx/store';

export const loadTerms = createAction('[Terms And Conditions] Load Terms');

export const loadTermsFail = createAction(
  '[Terms And Conditions] Load Terms Fail',
  props<Error>()
);

export const loadTermsSuccess = createAction(
  '[Terms And Conditions] Load Terms Success',
  props<{ terms: string }>()
);
