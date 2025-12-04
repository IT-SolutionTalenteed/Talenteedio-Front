import { Component, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { AuthenticationService } from '../../services/authentication.service';
import { AuthenticationState } from '../../store/reducers/authentication.reducers';
import { getSignUpError, getUserSaving } from '../../store/selectors/authentication.selectors';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { environment } from 'src/environments/environment';
import { PHONE_CONFIG } from '../../constants/authentication.constant';

@Component({
  selector: 'app-consultant-register-root',
  templateUrl: './consultant-register-root.component.html',
  styleUrls: ['./consultant-register-root.component.scss'],
})
export class ConsultantRegisterRootComponent implements OnInit, AfterViewInit {
  @ViewChild('first', { static: false }) firstInput: ElementRef;
  @ViewChild('password') passwordEl: ElementRef;
  @ViewChild('confirmationPassword') confirmationPasswordEl: ElementRef;
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  userSaving$: Observable<boolean>;
  signupError$: Observable<Error>;

  // Captcha variables
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

  config = PHONE_CONFIG;

  form: FormGroup;
  categories: Array<{ id: string; name: string }> = [];
  isSubmitting = false;
  cvFile: File | null = null;
  cvFileName: string = '';
  uploadingCV = false;
  cvFileError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private store: Store<AuthenticationState>,
    private apollo: Apollo,
    private cdr: ChangeDetectorRef
  ) {
    this.userSaving$ = this.store.pipe(select(getUserSaving));
    this.signupError$ = this.store.pipe(select(getSignUpError));
  }

  ngOnInit() {
    this.form = this.initForm();
    this.loadConsultantCategories();
  }

  ngAfterViewInit() {
    this.setFocusOnFirstInput();
    this.isWindowLoaded = typeof window !== 'undefined';
  }

  private initForm(): FormGroup {
    return this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        categoryId: ['', Validators.required],
        expertise: [''],
        yearsOfExperience: [''],
        cvId: ['', Validators.required],
        address_line: ['', Validators.required],
        postalCode: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmationPassword: ['', [Validators.required, Validators.minLength(6)]],
        recaptcha: [undefined, Validators.required],
      },
      {
        validator: this.confirmationPasswordValidator('password', 'confirmationPassword'),
      }
    );
  }

  private confirmationPasswordValidator =
    (passwordKey: string, confirmationPasswordKey: string) =>
    (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[passwordKey];
      const confirmationPasswordControl = formGroup.controls[confirmationPasswordKey];

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

  private setFocusOnFirstInput() {
    this.firstInput?.nativeElement?.focus();
  }

  showPassword(identifier: string) {
    const controls = {
      password: this.passwordEl,
      confirmationPassword: this.confirmationPasswordEl,
    };
    controls[identifier].nativeElement.type =
      controls[identifier].nativeElement.type === 'password' ? 'text' : 'password';
  }

  // Captcha methods
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

  private loadConsultantCategories() {
    const props = {
      input: { limit: null, page: null },
      filter: { name: '', status: 'public' },
    };
    this.apollo
      .query<any>({
        query: gql`
          query GetCategories($input: PaginationInput, $filter: CategoryFilter) {
            getCategories(input: $input, filter: $filter) {
              rows {
                id
                name
              }
            }
          }
        `,
        variables: props,
        fetchPolicy: 'network-only',
        context: {
          uri: `${environment.apiBaseUrl}/category`,
        },
      })
      .subscribe((res) => {
        this.categories = res?.data?.getCategories?.rows ?? [];
      });
  }

  onCVFileSelected(event: any) {
    const file = event.target.files[0];
    this.cvFileError = '';
    
    if (file) {
      // Vérifier que c'est un PDF
      if (file.type !== 'application/pdf') {
        this.cvFileError = 'Please select a PDF file';
        this.cvFile = null;
        this.cvFileName = '';
        event.target.value = '';
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.cvFileError = 'File size must not exceed 5MB';
        this.cvFile = null;
        this.cvFileName = '';
        event.target.value = '';
        return;
      }

      this.cvFile = file;
      this.cvFileName = file.name;
      this.uploadCV();
    }
  }

  uploadCV() {
    if (!this.cvFile) return;

    this.uploadingCV = true;
    this.cvFileError = '';
    
    this.authService.uploadMedia(this.cvFile, 'pdf').subscribe({
      next: (response: any) => {
        this.uploadingCV = false;
        const cvId = response?.data?.result?.id;
        if (cvId) {
          this.form.patchValue({ cvId });
        }
      },
      error: (error) => {
        this.uploadingCV = false;
        this.cvFileError = 'Upload failed. Please try again.';
        console.error('CV upload error:', error);
        this.cvFile = null;
        this.cvFileName = '';
        this.form.patchValue({ cvId: '' });
      },
    });
  }

  removeCVFile() {
    this.cvFile = null;
    this.cvFileName = '';
    this.cvFileError = '';
    this.form.patchValue({ cvId: '' });
  }

  submit() {
    if (this.isSubmitting) {
      return;
    }
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.form.value;
      
    const payload = {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      password: formValue.password,
      confirmationPassword: formValue.confirmationPassword,
      role: 'consultant',
      phone: (formValue.phone as any)?.internationalNumber || formValue.phone,
      categoryId: formValue.categoryId,
      expertise: formValue.expertise,
      yearsOfExperience: formValue.yearsOfExperience ? parseInt(formValue.yearsOfExperience) : null,
      address_line: formValue.address_line,
      postalCode: formValue.postalCode,
      city: formValue.city,
      state: formValue.state,
      country: formValue.country,
      values: [],
      cvId: formValue.cvId,
      recaptcha: formValue.recaptcha,
    };

    this.authService.signUpUser(payload as any).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        // Rediriger vers la page de connexion
        // Le consultant recevra un email de confirmation
        this.store.dispatch(go({ path: ['/authentication/sign-in'] }));
      },
      error: () => {
        this.isSubmitting = false;
        if (this.captchaElem) {
          this.captchaElem.resetCaptcha();
        }
      },
    });
  }
}
