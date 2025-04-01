import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PrivacyPolicyState } from '../reducers/privacy-policy.reducers';

export const getPrivacyPolicyState =
  createFeatureSelector<PrivacyPolicyState>('privacyPolicy');

export const getPrivacyPolicy = createSelector(
  getPrivacyPolicyState,
  (state: PrivacyPolicyState) => state.privacy
);

export const getPrivacyPolicyLoading = createSelector(
  getPrivacyPolicyState,
  (state: PrivacyPolicyState) => state.privacyLoading
);
