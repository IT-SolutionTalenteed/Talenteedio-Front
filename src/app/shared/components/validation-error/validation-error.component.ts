import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

type ValidationErrorType =
  | 'required'
  | 'email'
  | 'min'
  | 'max'
  | 'minlength'
  | 'maxlength'
  | 'chooseASim'
  | 'notEnoughBalance'
  | 'invalidOtp'
  | 'emailAlreadyUsed'
  | 'invalid';

const VALIDATION_ERROR_LABELS: Record<ValidationErrorType, string> = {
  required: 'Required',
  invalid: 'Invalid phone number',
  email: 'Invalid email',
  min: 'Too small',
  max: 'Too big',
  minlength: 'Troo short',
  maxlength: 'Troo long',
  chooseASim: 'Please choose at least one SIM card to proceed with payment',
  notEnoughBalance: ' Insufficient selected balances',
  invalidOtp: 'Invalid OTP code',
  emailAlreadyUsed: 'Email already registered',
};

@Component({
  selector: 'app-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.scss'],
})
export class ValidationErrorComponent {
  errorLabels: Record<ValidationErrorType, string> = VALIDATION_ERROR_LABELS;
  @Input() control: AbstractControl;
  @Input() customErrorLabels?: Record<string, string>;
}
