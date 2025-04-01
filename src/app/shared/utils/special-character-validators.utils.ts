/* eslint-disable @typescript-eslint/no-namespace */
import { AbstractControl, ValidationErrors } from '@angular/forms';

export namespace SpecialCharacterValidatorUtils {
    export const characterValidator = (control: AbstractControl): ValidationErrors | null => {
        const regex = /^[a-zA-Z0-9 .-_]*$/;
        return regex.test(control.value) ? null : { invalidSpecialCharacter: true };
    };
}
