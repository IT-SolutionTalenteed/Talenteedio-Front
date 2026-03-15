import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { logIn, signupUser, clearError, loadValues } from 'src/app/authentication/store/actions/authentication.actions';
import { getEmailErrorMessage, getAuthenticationLoading, getValues, getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Role, RoleName } from 'src/app/shared/models/role.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { PHONE_CONFIG } from 'src/app/authentication/constants/authentication.constant';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { environment } from 'src/environments/environment';
import { JobType } from 'src/app/shared/models/job.interface';

@Component({
  selector: 'app-auth-modal-inline',
  templateUrl: './auth-modal-inline.component.html',
  styleUrls: ['./auth-modal-inline.component.scss']
})
export class AuthModalInlineComponent implements OnInit, OnDestroy {
  @Output() authenticated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @ViewChild('password') passwordEl: ElementRef;
  @ViewChild('confirmPassword') confirmPasswordEl: ElementRef;
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  private destroy$ = new Subject<void>();
  private wasAuthenticated = false;

  currentView: 'login' | 'register' | 'choice' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  selectedRole: 'talent' | 'company' | null = null;
  emailError$: Observable<string>;
  loading$: Observable<boolean>;
  values$: Observable<Value[]>;
  jobTypes$: Observable<JobType[]>;
  workModes$: Observable<JobType[]>;
  showPassword = false;
  showConfirmPassword = false;
  consentLink = '/assets/talent_consent.pdf';

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
    this.jobTypes$ = this.authenticationService.getJobTypes({});
    this.workModes$ = new Observable(subscriber => {
      subscriber.next([
        { name: 'remote' },
        { name: 'hybrid' },
        { name: 'onsite' }
      ] as any);
      subscriber.complete();
    });
  }

  ngOnInit(): void {
    this.initForms();
    this.store.dispatch(loadValues());
    
    // Écouter les changements d'authentification
    this.store.select(getLoggedUser).pipe(
      takeUntil(this.destroy$),
      filter(user => !!user && !this.wasAuthenticated)
    ).subscribe(user => {
      this.wasAuthenticated = true;
      this.authenticated.emit();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
      recaptcha: [undefined, Validators.required]
    });

    this.registerForm = this.fb.group({
      // Champs de base
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmationPassword: ['', [Validators.required]],
      role: ['talent'], // Toujours talent par défaut

      // Champs professionnels (optionnels)
      values: [[]],
      cv: [null],
      yearsOfExperience: [''],
      competences: [''],
      languages: [''],
      formations: [''],
      interests: [''],

      // Salaire & Compensation (optionnels)
      tjm: [''],
      annualSalary: [''],
      salaryRange: [''],

      // Localisation (optionnels)
      country: [''],
      city: [''],
      address: [''],
      postalCode: [''],

      // Préférences de poste (optionnels)
      desiredPosition: [''],
      desiredContractType: [''],
      desiredCompanyType: [''],
      desiredSector: [''],
      mobility: [''],
      desiredWorkLocation: [''],
      availabilityDate: [''],
      workMode: [''],

      // Consentement et captcha
      consent: [false, [Validators.requiredTrue]],
      recaptcha: ['bypass'],
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

  switchView(view: 'login' | 'register' | 'choice'): void {
    // Si on clique sur inscription, montrer d'abord le choix
    if (view === 'register') {
      this.currentView = 'choice';
      this.selectedRole = null;
    } else {
      this.currentView = view;
    }

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

  onChooseTalent(): void {
    this.selectedRole = 'talent';
    this.currentView = 'register';
    this.registerForm.patchValue({ role: RoleName.TALENT });
  }

  onChooseCompany(): void {
    // Pour l'instant, on redirige vers la page d'inscription principale pour les entreprises
    // ou on peut afficher un message
    alert('L\'inscription entreprise sera bientôt disponible. Veuillez utiliser la page d\'inscription principale.');
  }

  backToChoice(): void {
    this.currentView = 'choice';
    this.selectedRole = null;
    this.registerForm.reset();
    this.registerForm.patchValue({ role: 'talent' });
  }



  isFormValidForSubmission(): boolean {
    // Vérifier uniquement les champs obligatoires
    const requiredFields = ['firstname', 'lastname', 'email', 'phone', 'password', 'confirmationPassword', 'consent'];
    const allRequiredValid = requiredFields.every(field => {
      const control = this.registerForm.get(field);
      return control && control.valid;
    });

    // Vérifier que les mots de passe correspondent
    const passwordsMatch = this.registerForm.get('password')?.value === this.registerForm.get('confirmationPassword')?.value;

    return allRequiredValid && passwordsMatch;
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

      // Construire l'objet userData avec tous les champs
      const userData: any = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        email: formValue.email,
        password: formValue.password,
        confirmationPassword: formValue.password,
        phone: (formValue.phone as any).internationalNumber,
        role: RoleName.TALENT,
        recaptcha: 'bypass',
        profilePicture: this.profilePictureId ? { id: this.profilePictureId } : null,
        values: formValue.values || [],
      };

      // Ajouter les champs optionnels s'ils sont remplis
      if (formValue.cv) userData.cv = formValue.cv;
      if (formValue.yearsOfExperience) userData.yearsOfExperience = formValue.yearsOfExperience;
      if (formValue.competences) userData.competences = formValue.competences;
      if (formValue.languages) userData.languages = formValue.languages;
      if (formValue.formations) userData.formations = formValue.formations;
      if (formValue.interests) userData.interests = formValue.interests;

      // Salaire & Compensation
      if (formValue.tjm) userData.tjm = formValue.tjm;
      if (formValue.annualSalary) userData.annualSalary = formValue.annualSalary;
      if (formValue.salaryRange) userData.salaryRange = formValue.salaryRange;

      // Localisation
      if (formValue.country) userData.country = formValue.country;
      if (formValue.city) userData.city = formValue.city;
      if (formValue.address) userData.address = formValue.address;
      if (formValue.postalCode) userData.postalCode = formValue.postalCode;

      // Préférences de poste
      if (formValue.desiredPosition) userData.desiredPosition = formValue.desiredPosition;
      if (formValue.desiredContractType) userData.desiredContractType = formValue.desiredContractType;
      if (formValue.desiredCompanyType) userData.desiredCompanyType = formValue.desiredCompanyType;
      if (formValue.desiredSector) userData.desiredSector = formValue.desiredSector;
      if (formValue.mobility) userData.mobility = formValue.mobility;
      if (formValue.desiredWorkLocation) userData.desiredWorkLocation = formValue.desiredWorkLocation;
      if (formValue.availabilityDate) userData.availabilityDate = formValue.availabilityDate;
      if (formValue.workMode) userData.workMode = formValue.workMode;

      console.log('Données envoyées au backend:', userData);
      this.store.dispatch(signupUser({ payload: userData }));
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  onCvChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ cv: file.name });
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

  closeModal(): void {
    this.closed.emit();
  }
}
