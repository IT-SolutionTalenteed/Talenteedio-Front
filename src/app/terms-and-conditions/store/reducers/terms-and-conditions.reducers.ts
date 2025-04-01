import { Action, createReducer, on } from '@ngrx/store';
import {
  loadTerms,
  loadTermsFail,
  loadTermsSuccess,
} from '../actions/terms-and-conditions.actions';

export interface TermsAndConditionsState {
  terms: string;
  termsLoading: boolean;
  termsLoaded: boolean;
}

const initialState: TermsAndConditionsState = {
  terms: '',
  termsLoading: false,
  termsLoaded: false,
};

const loadTermsReducer = (
  state: TermsAndConditionsState
): TermsAndConditionsState => ({
  ...state,
  termsLoading: true,
  termsLoaded: false,
});

const loadTermsFailReducer = (
  state: TermsAndConditionsState,
  props: Error
): TermsAndConditionsState => ({
  ...state,
  termsLoading: false,
  termsLoaded: false,
});

const loadTermsSuccessReducer = (
  state: TermsAndConditionsState,
  props: { terms: string }
): TermsAndConditionsState => ({
  ...state,
  termsLoading: false,
  termsLoaded: true,
  terms: props.terms,
});

const reducer = createReducer(
  initialState,
  on(loadTerms, loadTermsReducer),
  on(loadTermsFail, loadTermsFailReducer),
  on(loadTermsSuccess, loadTermsSuccessReducer)
);

export function termsAndConditionsReducer(
  state: TermsAndConditionsState | undefined,
  action: Action
) {
  return reducer(state, action);
}
