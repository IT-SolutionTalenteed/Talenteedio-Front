/* eslint-disable @typescript-eslint/no-namespace */
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MALAGASY_PHONE_REGEX, UNIVERSAL_PHONE_REGEX } from '../constants/shared.constant';
export namespace PhoneValidatorUtils {
    const genericPhoneValidator =
        (regexp: RegExp): ((AbstractControl) => ValidationErrors | null) =>
        (control: AbstractControl) =>
            control.value ? (control.value.every((phone) => regexp.test(phone)) ? null : { invalidPhones: true }) : null;

    export const malagasyPhoneValidator = genericPhoneValidator(MALAGASY_PHONE_REGEX);
    export const universalPhoneValidator = genericPhoneValidator(UNIVERSAL_PHONE_REGEX);
}
