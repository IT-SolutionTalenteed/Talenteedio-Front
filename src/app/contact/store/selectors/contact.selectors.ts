import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactState } from '../reducers/contact.reducers';

export const getContactState = createFeatureSelector<ContactState>('contact');

export const getSendEmailLoading = createSelector(
  getContactState,
  (state: ContactState) => state.sendMailLoading
);

export const getEmailSent = createSelector(
  getContactState,
  (state: ContactState) => state.emailSent
);
