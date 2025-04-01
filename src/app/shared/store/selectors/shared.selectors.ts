import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SharedState } from '../reducers/shared.reducers';

export const getSharedState = createFeatureSelector<SharedState>('shared');

export const getAutocompletionLoading = createSelector(
  getSharedState,
  (state: SharedState) => state.loading
);

export const getAutocompletionRoles = createSelector(
  getSharedState,
  (state: SharedState) => state.roles
);

export const getLocation = createSelector(
  getSharedState,
  (state: SharedState) => state.location
);

export const getLocationLoading = createSelector(
  getSharedState,
  (state: SharedState) => state.locationLoading
);

export const getLocations = createSelector(
  getSharedState,
  (state: SharedState) => state.locations
);

export const getAd = createSelector(
  getSharedState,
  (state: SharedState) => state.ad
);

export const getIsBecomeMemberModalOpen = createSelector(
  getSharedState,
  (state: SharedState) => state.isBecomeMemberModalOpen
);
