import { DatePipe } from '@angular/common';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';

export const markFormAsTouchedAndDirty = (form: UntypedFormGroup) =>
    Object.keys(form.controls).forEach((key) => {
        const currentControl = form.controls[key] as UntypedFormGroup;
        if (currentControl.controls) {
            markFormAsTouchedAndDirty(currentControl);
        }
        currentControl.markAsDirty();
        currentControl.markAsTouched();
    });

export const getFormArray = (form: UntypedFormGroup, formArrayName: string): UntypedFormArray =>
    form && (form.get(formArrayName) as UntypedFormArray);

export const dateForFormGroup = (date: Date | string): string => {
    if (!date) {
        return null;
    }
    const dp = new DatePipe(navigator.language);
    return dp.transform(new Date(date), 'y-MM-dd');
};

export const checkRequired = (control: AbstractControl): void => {
    control.setErrors(control.value ? null : { required: true });
};
