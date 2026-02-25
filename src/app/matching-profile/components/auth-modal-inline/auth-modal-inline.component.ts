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

  currentView: 'login' | 'register' | 'choice' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  selectedRole: 'talent' | 'company' | null = null;
  registrationStep: number = 1;
  maxSteps: number = 2;
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
      // Étape 1 - Qui je suis / Qui sommes-nous
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmationPassword: ['', [Validators.required]],
      
      // Talent - Qui je suis
      currentSalary: [''],
      experience: [''],
      skills: [''],
      cv: [''],
      languages: [''],
      country: [''],
      city: [''],
      education: [''],
      
      // Company - Qui sommes-nous
      companyName: [''],
      companyLogo: [''],
      foundedDate: [''],
      companyCountry: [''],
      sector: [''],
      employeeCount: [''],
      
      // Étape 2 - Ce que je veux / Ce que nous voulons
      // Talent - Ce que je veux
      desiredLocation: [''],
      desiredSector: [''],
      interests: [''],
      desiredPosition: [''],
      desiredSalary: [''],
      availability: [''],
      
      // Company - Ce que nous voulons
      profileSought: [''],
      positionsToFill: [''],
      requiredSkills: [''],
      requiredExperience: [''],
      
      role: ['', [Validators.required]],
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
    this.registrationStep = 1;
    this.maxSteps = 2;
    this.registerForm.patchValue({ role: RoleName.TALENT });
  }

  onChooseCompany(): void {
    this.selectedRole = 'company';
    this.currentView = 'register';
    this.registrationStep = 1;
    this.maxSteps = 2;
    this.registerForm.patchValue({ role: 'company' });
  }

  backToChoice(): void {
    this.currentView = 'choice';
    this.selectedRole = null;
    this.registrationStep = 1;
    this.registerForm.reset();
  }

  nextStep(): void {
    if (this.registrationStep < this.maxSteps) {
      this.registrationStep++;
    }
  }

  previousStep(): void {
    if (this.registrationStep > 1) {
      this.registrationStep--;
    }
  }

  isStep1Valid(): boolean {
    if (this.selectedRole === 'talent') {
      return !!(
        this.registerForm.get('firstname')?.valid &&
        this.registerForm.get('lastname')?.valid &&
        this.registerForm.get('email')?.valid &&
        this.registerForm.get('phone')?.valid &&
        this.registerForm.get('password')?.valid &&
        this.registerForm.get('confirmationPassword')?.valid
      );
    } else {
      return !!(
        this.registerForm.get('companyName')?.valid &&
        this.registerForm.get('email')?.valid &&
        this.registerForm.get('phone')?.valid &&
        this.registerForm.get('password')?.valid &&
        this.registerForm.get('confirmationPassword')?.valid
      );
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
      
      // Données de base communes à tous les rôles
      const userData: any = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        email: formValue.email,
        password: formValue.password,
        confirmationPassword: formValue.password,
        phone: (formValue.phone as any).internationalNumber,
        role: this.selectedRole === 'talent' ? RoleName.TALENT : 'company',
        recaptcha: 'bypass',
        profilePicture: this.profilePictureId ? { id: this.profilePictureId } : null
      };

      // Ajouter les champs spécifiques selon le rôle
      if (this.selectedRole === 'talent') {
        // Étape 1 - Qui je suis
        if (formValue.currentSalary) userData.currentSalary = formValue.currentSalary;
        if (formValue.experience) userData.experience = formValue.experience;
        if (formValue.skills) userData.skills = formValue.skills;
        if (formValue.cv) userData.cvId = formValue.cv;
        if (formValue.languages) userData.languages = formValue.languages;
        if (formValue.country) userData.country = formValue.country;
        if (formValue.city) userData.city = formValue.city;
        if (formValue.education) userData.education = formValue.education;
        
        // Étape 2 - Ce que je veux
        if (formValue.desiredLocation) userData.desiredLocation = formValue.desiredLocation;
        if (formValue.desiredSector) userData.desiredSector = formValue.desiredSector;
        if (formValue.interests) userData.interests = formValue.interests;
        if (formValue.desiredPosition) userData.desiredPosition = formValue.desiredPosition;
        if (formValue.desiredSalary) userData.desiredSalary = formValue.desiredSalary;
        if (formValue.availability) userData.availability = formValue.availability;
        
        // Valeurs par défaut pour compatibilité backend
        userData.values = formValue.values || [];
      } else if (this.selectedRole === 'company') {
        // Étape 1 - Qui sommes-nous
        userData.company_name = formValue.companyName;
        if (formValue.companyLogo) userData.logoId = formValue.companyLogo;
        if (formValue.foundedDate) userData.foundedDate = formValue.foundedDate;
        if (formValue.companyCountry) userData.country = formValue.companyCountry;
        if (formValue.sector) userData.categoryId = formValue.sector; // Le backend utilise categoryId
        if (formValue.employeeCount) userData.employeeCount = formValue.employeeCount;
        
        // Étape 2 - Ce que nous voulons
        if (formValue.profileSought) userData.profileSought = formValue.profileSought;
        if (formValue.positionsToFill) userData.positionsToFill = formValue.positionsToFill;
        if (formValue.requiredSkills) userData.requiredSkills = formValue.requiredSkills;
        if (formValue.requiredExperience) userData.requiredExperience = formValue.requiredExperience;
      }
      
      console.log('Données envoyées au backend:', userData);
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
