import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TermsAndConditionsState } from '../reducers/terms-and-conditions.reducers';

export const getTermsAndConditionsState =
  createFeatureSelector<TermsAndConditionsState>('termsAndConditions');

export const getTerms = createSelector(
  getTermsAndConditionsState,
  (state: TermsAndConditionsState) => state.terms
);

export const getTermsLoading = createSelector(
  getTermsAndConditionsState,
  (state: TermsAndConditionsState) => state.termsLoading
);
