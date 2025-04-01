import { Action, createReducer, on } from '@ngrx/store';
import {
  sendEmail,
  sendEmailFail,
  sendEmailSuccess,
} from '../actions/join-us.actions';

export interface JoinUsState {
  sendMailLoading: boolean;
  emailSent: boolean;
}

const initialState: JoinUsState = {
  sendMailLoading: false,
  emailSent: false,
};

const sendEmailReducer = (state: JoinUsState): JoinUsState => ({
  ...state,
  sendMailLoading: true,
  emailSent: false,
});

const sendEmailSuccessReducer = (state: JoinUsState): JoinUsState => ({
  ...state,
  sendMailLoading: false,
  emailSent: true,
});

const sendEmailFailReducer = (state: JoinUsState): JoinUsState => ({
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

export function joinUsReducer(state: JoinUsState | undefined, action: Action) {
  return reducer(state, action);
}
