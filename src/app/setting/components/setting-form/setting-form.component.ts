import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Language } from 'src/app/shared/models/language.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { EMPTY_SETTING } from '../../constants/setting.constant';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})
export class SettingFormComponent {

    @Input() set setting(setting: Setting) {
        if (setting) {
            this.form = this.initForm(setting);
            setTimeout(() => {
                 this.setFocusOnFirstInput();
            });
        }
    }
    form = this.initForm(EMPTY_SETTING);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() set error(value: any) {
        if (value && value.error.msg === 'This email already exists!') {
            this.form?.controls['email'].setErrors({ emailAlreadyUsed: true });
        }
    }
    @Output() save: EventEmitter<Setting> = new EventEmitter<Setting>();
    @ViewChild('first', { static: false }) firstInput: ElementRef;

    languages: Language[] = [
        {
            id: 'fr',
        },
        {
            id: 'eng',
        }
    ];
    customErrorLabels: Record<string, string> = {
        email: 'Invalid email',
        invalidPhones: 'Numero(s) invalide(s)',
    };

    constructor(private formBuilder: FormBuilder) {}

    // ngAfterViewInit() {
    //     this.setFocusOnFirstInput();
    // }

    onSubmit(form: FormGroup) {
        const setting = form.value as Setting;
        this.form.valid
            ? this.save.emit(setting)
            : this.showErrors();
    }

    private setFocusOnFirstInput() {
        this.firstInput.nativeElement.focus();
    }

    private showErrors() {
        markFormAsTouchedAndDirty(this.form);
    }

    private initForm(setting: Setting): FormGroup {
        return this.formBuilder.group(
            {
                siteTitle: [setting.siteTitle, Validators.required],
                siteDescription: [setting.siteDescription, Validators.required],
                favicon: [setting.favicon, Validators.required],
                language: [setting.language, Validators.required],
                email: [setting.contact.email, Validators.required],
                address: [setting.contact.address, Validators.required],
            }
        );
    }
}
