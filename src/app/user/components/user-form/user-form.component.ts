import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { first, of, switchMap, timer } from 'rxjs';
import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { EMPTY_USER } from '../../constants/user.constant';
import { UserService } from '../../services/user.service';

const PASSWORD_MIN_LENGTH = 4;

const confirmPasswordValidator = (passwordKey: string, confirmPasswordKey: string) => (formGroup: UntypedFormGroup) => {
    const passwordControl = formGroup.controls[passwordKey];
    const confirmPasswordControl = formGroup.controls[confirmPasswordKey];

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']) {
        return;
    }

    confirmPasswordControl.setErrors(passwordControl.value !== confirmPasswordControl.value ? { mustMatch: true } : null);
};

interface UserForm {
    firstName: FormControl<string>;
}

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnChanges {
    @Input() isEditing: boolean;
    @Input() editEnabled = true;
    @Input() roles: Role[];
    @Input() user: User;

    @Output() edit: EventEmitter<User> = new EventEmitter<User>();
    @Output() save: EventEmitter<User> = new EventEmitter<User>();
    @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() close: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('first', { static: false }) firstInput: ElementRef;

    form = this.initForm(EMPTY_USER);

    // eslint-disable-next-line max-params
    constructor(private formBuilder: UntypedFormBuilder, private userService: UserService) {}

    ngOnChanges() {
        if (this.user) {
            this.form = this.initForm(this.user);

            this.isEditing ? this.form.enable() : this.form.disable();
            setTimeout(() => this.isEditing && this.setFocusOnFirstInput());
            this.setAsyncValidator();
        }
    }

    onSubmit(form: UntypedFormGroup) {
        this.form.valid ? this.save.emit(form.value) : this.showErrors();
    }

    private setAsyncValidator() {
        this.form.get('email').setAsyncValidators(this.checkDuplication.bind(this));
        this.form.get('email').updateValueAndValidity();
    }

    private setFocusOnFirstInput() {
        this.firstInput.nativeElement.focus();
    }

    private showErrors() {
        markFormAsTouchedAndDirty(this.form);
    }

    private initForm(user: User) {
        const localForm = this.formBuilder.group(
            {
                id: [user.id],
                role: [user.role, Validators.required],
                password: [
                    null,
                    user.id
                        ? this.editionPasswordValidator
                        : Validators.compose([Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]),
                ],
                confirmPassword: [
                    null,
                    user.id
                        ? this.editionPasswordValidator
                        : Validators.compose([Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]),
                ],
            },
            {
                validator: confirmPasswordValidator('password', 'confirmPassword'),
            }
        );
        return localForm;
    }

    private editionPasswordValidator = (control: AbstractControl): ValidationErrors =>
        !control.value ? null : control.value.trim().length >= PASSWORD_MIN_LENGTH ? null : { minLength: { value: control.value } };

    private checkDuplication(control: AbstractControl) {
        if (control.value === this.user.email) {
            // if value is equal to original value, do not run validator
            return of(null);
        }

        return timer(500).pipe(
            switchMap(() => this.userService.checkDuplication({ ...this.form.value, email: control.value })),
            first()
        );
    }
}
