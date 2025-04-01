import { createAction, props } from '@ngrx/store';
import { JoinUsForm } from '../../types/join-us-form.interface';

export const sendEmail = createAction(
  '[Join Us] Send Email',
  props<JoinUsForm & { recaptcha: string }>()
);
export const sendEmailFail = createAction(
  '[Join Us]  Send Email Fail',
  props<Error>()
);
export const sendEmailSuccess = createAction('[Join Us] Send Email Success');
