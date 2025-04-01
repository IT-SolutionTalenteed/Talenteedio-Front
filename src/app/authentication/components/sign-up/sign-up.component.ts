import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { UNIVERSAL_PHONE_REGEX } from 'src/app/shared/constants/shared.constant';
import { Role, RoleName } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { EMPTY_USER } from 'src/app/user/constants/user.constant';
import { environment } from 'src/environments/environment';
import {
  CONSENT_LINK,
  PASSWORD_MIN_LENGTH,
  PHONE_CONFIG,
} from '../../constants/authentication.constant';
import { ALL_COUNTRIES } from '../../constants/countries.constant';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set error(value: any) {
    if (value && value.error.msg === 'This email already exists!') {
      this.form?.controls['email'].setErrors({ emailAlreadyUsed: true });
    }
    if (value) {
      this.captchaElem.resetCaptcha();
    }
    // else {
    //     // console.log(value.error.msg);
    //     this.form?.controls['email'].setErrors({ emailAlreadyUsed: false });
    // }
  }
  @Output() save: EventEmitter<User> = new EventEmitter<User>();
  @Input() values: Value[];

  @ViewChild('first', { static: false }) firstInput: ElementRef;
  @ViewChild('password') passwordEl: ElementRef;
  @ViewChild('confirmationPassword') confirmationPasswordEl: ElementRef;
  @ViewChild('phonesSelect') phonesSelect;

  // captcha variables
  isWindowLoaded = typeof window !== 'undefined';
  public readonly siteKey = environment.siteKey;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public useGlobalDomain = false;

  consentLink = CONSENT_LINK;

  roleNameTalent = RoleName.TALENT;

  config = PHONE_CONFIG;

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  form: FormGroup;
  customErrorLabels: Record<string, string> = {
    email: 'Invalid email',
    invalidPhones: 'Invalid phone numbers',
  };

  today = new Date();
  countries = ALL_COUNTRIES.map((it) => it.name);
  roles: Role[] = [
    {
      id: null,
      name: RoleName.REFERRAL,
      title: 'Referral',
    },
    {
      id: null,
      name: RoleName.TALENT,
      title: 'Talent',
    },
  ];
  cv: File;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private gaService: GoogleAnalyticsService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    if (!this.form) {
      this.form = this.initForm(EMPTY_USER);
      this.form.get('role').valueChanges.subscribe((role) => {
        const consentControl = this.form.get('consent');
        const valuesControl = this.form.get('values');
        const cvControl = this.form.get('cv');

        if (role === this.roleNameTalent) {
          consentControl.setValidators([Validators.required]);
          valuesControl.setValidators([Validators.required]);
          cvControl.addValidators([Validators.required]);
        } else {
          consentControl.clearValidators();
          valuesControl.clearValidators();
          cvControl.clearValidators();
        }
        // Update the 'consent' control's validation status
        consentControl.updateValueAndValidity();
      });
    }
  }

  ngAfterViewInit() {
    this.setFocusOnFirstInput();
    this.isWindowLoaded = typeof window !== 'undefined';
  }

  onCvChange(event) {
    this.cv = event.target.files[0];
    // this.form.patchValue({ cv: this.cv as File });
  }

  onSubmit(form: FormGroup) {
    const user = form.value as User;

    if (form.value.role === this.roleNameTalent) {
      this.form.valid
        ? this.authenticationService
            .uploadMedia(this.cv, 'pdf')
            .subscribe((res) => {
              this.save.emit({
                ...user,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                phone: (user.phone as any).internationalNumber,
                cvId: res.data.result.id,
              });
            })
        : this.showErrors();
    } else {
      this.form.valid
        ? this.save.emit({
            ...user,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            phone: (user.phone as any).internationalNumber,
          })
        : this.showErrors();
    }
  }

  addTag(tag: string) {
    return tag;
  }

  onType({ term: phoneNumber }) {
    if (UNIVERSAL_PHONE_REGEX.test(phoneNumber)) {
      this.phonesSelect.select({ value: phoneNumber, label: phoneNumber });
    }
  }

  showPassword(identifier) {
    const controls = {
      password: this.passwordEl,
      confirmationPassword: this.confirmationPasswordEl,
    };
    controls[identifier].nativeElement.type =
      controls[identifier].nativeElement.type === 'password'
        ? 'text'
        : 'password';
  }

  private setFocusOnFirstInput() {
    this.firstInput?.nativeElement?.focus();
  }

  private showErrors() {
    markFormAsTouchedAndDirty(this.form);
  }

  private initForm(user: User): FormGroup {
    return this.formBuilder.group(
      {
        email: [
          user.email,
          Validators.compose([Validators.required, Validators.email]),
        ],
        role: [user.role, Validators.required],
        values: [user.values],
        cv: [null, this.cvValidator],
        firstname: [user.firstname, Validators.required],
        lastname: [user.lastname, Validators.required],
        password: [user.password, Validators.required],
        confirmationPassword: [''],
        recaptcha: [undefined, Validators.required],
        consent: [false],
        phone: [user.phone, Validators.compose([Validators.required])],
      },
      {
        validator: this.confirmationPasswordValidator(
          'password',
          'confirmationPassword'
        ),
      }
    );
  }

  private cvValidator = (
    control: AbstractControl | null
  ): ValidationErrors | null => {
    const file = control.value as string;

    if (file) {
      const extension = file.includes('.pdf');

      return extension ? null : { extensionError: true };
    } else {
      return null;
    }
  };

  private confirmationPasswordValidator =
    (passwordKey: string, confirmationPasswordKey: string) =>
    (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[passwordKey];
      const confirmationPasswordControl =
        formGroup.controls[confirmationPasswordKey];

      if (
        confirmationPasswordControl?.errors &&
        !confirmationPasswordControl?.errors['mustMatch']
      ) {
        return;
      }

      confirmationPasswordControl?.setErrors(
        passwordControl?.value !== confirmationPasswordControl?.value
          ? { mustMatch: true }
          : null
      );
    };

  private editionPasswordValidator = (
    control: AbstractControl
  ): ValidationErrors =>
    !control.value
      ? null
      : control.value.trim().length >= PASSWORD_MIN_LENGTH
      ? null
      : { minLength: { value: control.value } };

  // captcha method

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }
}
