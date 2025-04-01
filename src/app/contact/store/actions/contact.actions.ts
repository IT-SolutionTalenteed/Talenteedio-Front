import { createAction, props } from '@ngrx/store';
import { ContactEmail } from '../../types/contact-email.interface';

export const sendEmail = createAction(
  '[Contact] Send Email',
  props<ContactEmail & {to: string}>()
);
export const sendEmailFail = createAction(
  '[Contact]  Send Email Fail',
  props<Error>()
);
export const sendEmailSuccess = createAction('[Contact] Send Email Success');
