import { Action, createReducer, on } from '@ngrx/store';
import { Contact } from 'src/app/shared/models/contact.interface';
import {
  sendEmail,
  sendEmailFail,
  sendEmailSuccess,
} from '../actions/contact.actions';

export interface ContactState {
  location: Contact;
  locationLoading: boolean;
  sendMailLoading: boolean;
  emailSent: boolean;
}

const initialState: ContactState = {
  location: undefined,
  locationLoading: false,
  sendMailLoading: false,
  emailSent: false,
};

const sendEmailReducer = (state: ContactState): ContactState => ({
  ...state,
  sendMailLoading: true,
  emailSent: false,
});

const sendEmailSuccessReducer = (state: ContactState): ContactState => ({
  ...state,
  sendMailLoading: false,
  emailSent: true,
});

const sendEmailFailReducer = (state: ContactState): ContactState => ({
  ...state,
  sendMailLoading: false,
  emailSent: false,
});

const reducer = createReducer(
  initialState,
  on(sendEmail, sendEmailReducer),
  on(sendEmailSuccess, sendEmailSuccessReducer),
  on(sendEmailFail, sendEmailFailReducer)
);

export function contactReducer(
  state: ContactState | undefined,
  action: Action
) {
  return reducer(state, action);
}
