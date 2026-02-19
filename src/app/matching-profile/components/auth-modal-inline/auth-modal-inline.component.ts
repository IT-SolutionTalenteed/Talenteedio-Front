import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { logIn, signupUser, clearError } from 'src/app/authentication/store/actions/authentication.actions';
import { getEmailErrorMessage, getAuthenticationLoading, getValues } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Role, RoleName } from 'src/app/shared/models/role.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { PHONE_CONFIG } from 'src/app/authentication/constants/authentication.constant';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth-modal-inline',
  templateUrl: './auth-modal-inline.component.html',
  styleUrls: ['./auth-modal-inline.component.scss']
})
export class AuthModalInlineComponent implements OnInit {
  @Output() authenticated = new EventEmitter<void>();
  @ViewChild('password') passwordEl: ElementRef;
  @ViewChild('confirmPassword') confirmPasswordEl: ElementRef;
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  currentView: 'login' | 'register' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  emailError$: Observable<string>;
  loading$: Observable<boolean>;
  values$: Observable<Value[]>;
  showPassword = false;
  showConfirmPassword = false;

  // Captcha configuration
  public siteKey = environment.siteKey;
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'fr';
  public type: 'image' | 'audio' = 'image';
  public useGlobalDomain = false;

  roleNameTalent = RoleName.TALENT;
  
  config = {
    ...PHONE_CONFIG,
    options: {
      ...PHONE_CONFIG.options,
      customContainer: 'intl-tel-input',
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      // Utiliser les drapeaux SVG depuis nos assets
      flagsPath: '/assets/img/flags/',
    }
  };
  
  roles: Role[] = [
    {
      id: null,
      name: RoleName.TALENT,
      title: 'Talent',
    },
  ];

  profilePictureId: string | null = null;
  profilePictureUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private authenticationService: AuthenticationService
  ) {
    this.emailError$ = this.store.select(getEmailErrorMessage);
    this.loading$ = this.store.select(getAuthenticationLoading);
    this.values$ = this.store.select(getValues);
  }

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
      recaptcha: [undefined, Validators.required]
    });

    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmationPassword: ['', [Validators.required]],
      recaptcha: ['bypass'], // Bypass pour le modal
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password');
    const confirmPassword = g.get('confirmationPassword');
    
    if (confirmPassword?.errors && !confirmPassword?.errors['mustMatch']) {
      return;
    }

    confirmPassword?.setErrors(
      password?.value !== confirmPassword?.value ? { mustMatch: true } : null
    );
  }

  switchView(view: 'login' | 'register'): void {
    this.currentView = view;
    this.store.dispatch(clearError());
    this.loginForm.reset();
    this.registerForm.reset();
    this.profilePictureId = null;
    this.profilePictureUrl = null;
    
    // Reset captcha when switching views
    if (this.captchaElem) {
      this.captchaElem.resetCaptcha();
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe,
        recaptcha: this.loginForm.value.recaptcha
      };
      this.store.dispatch(logIn(credentials));
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const userData: any = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        email: formValue.email,
        password: formValue.password,
        phone: (formValue.phone as any).internationalNumber,
        role: formValue.role,
        recaptcha: 'bypass',
        profilePicture: this.profilePictureId ? { id: this.profilePictureId } : null
      };
      
      this.store.dispatch(signupUser({ payload: userData }));
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  onProfilePictureChanged(pictureId: string): void {
    this.profilePictureId = pictureId;
  }

  onProfilePictureRemoved(): void {
    this.profilePictureId = null;
    this.profilePictureUrl = null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  clearError(): void {
    this.store.dispatch(clearError());
  }
}
