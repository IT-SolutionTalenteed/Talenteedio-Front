import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JoinUsState } from '../reducers/join-us.reducers';

export const getJoinUsState = createFeatureSelector<JoinUsState>('joinUs');

export const getSendEmailLoading = createSelector(
  getJoinUsState,
  (state: JoinUsState) => state.sendMailLoading
);

export const getEmailSent = createSelector(
  getJoinUsState,
  (state: JoinUsState) => state.emailSent
);
