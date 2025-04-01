import { Action, createReducer, on } from '@ngrx/store';
import {
  loadPrivacy,
  loadPrivacyFail,
  loadPrivacySuccess,
} from '../actions/privacy-policy.actions';

export interface PrivacyPolicyState {
  privacy: string;
  privacyLoading: boolean;
  privacyLoaded: boolean;
}

const initialState: PrivacyPolicyState = {
  privacy: '',
  privacyLoading: false,
  privacyLoaded: false,
};

const loadPrivacyReducer = (state: PrivacyPolicyState): PrivacyPolicyState => ({
  ...state,
  privacyLoading: true,
  privacyLoaded: false,
});

const loadPrivacyFailReducer = (
  state: PrivacyPolicyState,
  props: Error
): PrivacyPolicyState => ({
  ...state,
  privacyLoading: false,
  privacyLoaded: false,
});

const loadPrivacySuccessReducer = (
  state: PrivacyPolicyState,
  props: { privacy: string }
): PrivacyPolicyState => ({
  ...state,
  privacy: props.privacy,
  privacyLoading: false,
  privacyLoaded: true,
});

const reducer = createReducer(
  initialState,
  on(loadPrivacy, loadPrivacyReducer),
  on(loadPrivacyFail, loadPrivacyFailReducer),
  on(loadPrivacySuccess, loadPrivacySuccessReducer)
);

export function privacyPolicyReducer(
  state: PrivacyPolicyState | undefined,
  action: Action
) {
  return reducer(state, action);
}
