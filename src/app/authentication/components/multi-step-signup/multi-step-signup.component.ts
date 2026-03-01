import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { signupUser, clearError, loadValues } from '../../store/actions/authentication.actions';
import { getAuthenticationLoading, getValues, getLoggedUser } from '../../store/selectors/authentication.selectors';
import { RoleName } from 'src/app/shared/models/role.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { PHONE_CONFIG } from '../../constants/authentication.constant';
import { AuthenticationService } from '../../services/authentication.service';
import { MatchingService, CompanyMatchScore } from '../../services/matching.service';
import { environment } from 'src/environments/environment';
import { JobType } from 'src/app/shared/models/job.interface';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-multi-step-signup',
  templateUrl: './multi-step-signup.component.html',
  styleUrls: ['./multi-step-signup.component.scss']
})
export class MultiStepSignupComponent implements OnInit {
  @ViewChild('password') passwordEl: ElementRef;
  @ViewChild('confirmPassword') confirmPasswordEl: ElementRef;
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  // Étapes du workflow
  currentStep: 'form' | 'intro' | 'matching' | 'results' | 'appointment' = 'form';
  
  // Formulaire d'inscription
  registerForm: FormGroup;
  
  // Données de matching
  matchingResults: CompanyMatchScore[] = [];
  selectedCompanies: Set<string> = new Set();
  matchingProgress = 0;
  matchingMessage = '';
  isMatching = false;
  
  // Sélection pour rendez-vous
  selectedCompany: CompanyMatchScore | null = null;
  
  // Observables
  loading$: Observable<boolean>;
  values$: Observable<Value[]>;
  jobTypes$: Observable<JobType[]>;
  workModes$: Observable<JobType[]>;
  currentUser$: Observable<any>;
  
  // UI State
  showPassword = false;
  showConfirmPassword = false;
  consentLink = '/assets/talent_consent.pdf';
  
  // Captcha
  public siteKey = environment.siteKey;
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'fr';
  public type: 'image' | 'audio' = 'image';
  public useGlobalDomain = false;
  
  // Phone config
  config = {
    ...PHONE_CONFIG,
    options: {
      ...PHONE_CONFIG.options,
      customContainer: 'intl-tel-input',
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      flagsPath: '/assets/img/flags/',
    }
  };
  
  profilePictureId: string | null = null;
  profilePictureUrl: string | null = null;
  cvFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private authenticationService: AuthenticationService,
    private matchingService: MatchingService
  ) {
    this.loading$ = this.store.select(getAuthenticationLoading);
    this.values$ = this.store.select(getValues);
    this.currentUser$ = this.store.select(getLoggedUser);
    this.jobTypes$ = this.authenticationService.getJobTypes({});
    this.workModes$ = of([
      { name: 'remote' },
      { name: 'hybrid' },
      { name: 'onsite' }
    ] as any);
  }

  ngOnInit(): void {
    this.initForm();
    this.store.dispatch(loadValues());
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      // Champs obligatoires
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmationPassword: ['', [Validators.required]],
      
      // Champs professionnels (optionnels)
      values: [[]],
      cv: [null],
      yearsOfExperience: [''],
      competences: [''],
      languages: [''],
      formations: [''],
      interests: [''],
      
      // Salaire & Compensation
      tjm: [''],
      annualSalary: [''],
      salaryRange: [''],
      
      // Localisation
      country: [''],
      city: [''],
      address: [''],
      postalCode: [''],
      
      // Préférences de poste
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

  onCvChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.cvFile = file;
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

  /**
   * STEP 1: Soumettre le formulaire d'inscription
   */
  async onSubmitRegistration(): Promise<void> {
    if (!this.registerForm.valid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.registerForm.value;
    
    // Construire l'objet userData
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

    // Ajouter les champs optionnels
    const optionalFields = [
      'yearsOfExperience', 'competences', 'languages', 'formations', 'interests',
      'tjm', 'annualSalary', 'salaryRange',
      'country', 'city', 'address', 'postalCode',
      'desiredPosition', 'desiredContractType', 'desiredCompanyType', 'desiredSector',
      'mobility', 'desiredWorkLocation', 'availabilityDate', 'workMode'
    ];

    optionalFields.forEach(field => {
      if (formValue[field]) {
        userData[field] = formValue[field];
      }
    });

    // Upload CV si présent
    if (this.cvFile) {
      try {
        const cvUploadResult = await this.authenticationService.uploadMedia(this.cvFile, 'pdf').toPromise();
        userData.cvId = cvUploadResult.data.result.id;
      } catch (error) {
        console.error('Error uploading CV:', error);
      }
    }

    // Dispatch l'action d'inscription
    this.store.dispatch(signupUser({ payload: userData }));

    // Attendre que l'utilisateur soit créé puis passer à l'intro
    this.currentUser$.pipe(
      filter(user => !!user),
      take(1)
    ).subscribe(user => {
      this.showIntroAndStartMatching(user.id);
    });
  }

  /**
   * STEP 2: Afficher l'intro puis démarrer le matching
   */
  private async showIntroAndStartMatching(userId: string): Promise<void> {
    // Afficher l'écran d'introduction
    this.currentStep = 'intro';
    
    // Attendre 3 secondes avant de démarrer le matching
    setTimeout(() => {
      this.startMatching(userId);
    }, 3000);
  }

  /**
   * STEP 3: Démarrer le matching
   */
  private async startMatching(userId: string): Promise<void> {
    this.currentStep = 'matching';
    this.isMatching = true;
    this.matchingProgress = 0;
    this.matchingMessage = 'Analyse de votre profil...';

    // Simuler une progression
    const progressInterval = setInterval(() => {
      if (this.matchingProgress < 90) {
        this.matchingProgress += 10;
        
        if (this.matchingProgress === 30) {
          this.matchingMessage = 'Recherche des entreprises correspondantes...';
        } else if (this.matchingProgress === 60) {
          this.matchingMessage = 'Analyse des offres d\'emploi...';
        } else if (this.matchingProgress === 90) {
          this.matchingMessage = 'Finalisation du matching...';
        }
      }
    }, 500);

    try {
      // Extraire le texte du CV si disponible
      let cvText = '';
      if (this.cvFile) {
        // Note: Dans un cas réel, vous devriez extraire le texte côté backend
        // Ici on envoie juste le nom du fichier
        cvText = this.cvFile.name;
      }

      // Appeler le service de matching
      const result = await this.matchingService.matchTalentWithCompanies(userId, cvText).toPromise();
      
      clearInterval(progressInterval);
      this.matchingProgress = 100;
      this.matchingMessage = 'Matching terminé !';
      this.matchingResults = result.matches;
      
      // Attendre un peu avant de montrer les résultats
      setTimeout(() => {
        this.isMatching = false;
        this.currentStep = 'results';
      }, 1000);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error during matching:', error);
      this.matchingMessage = 'Erreur lors du matching. Veuillez réessayer.';
      this.isMatching = false;
    }
  }

  /**
   * STEP 4: Sélectionner/désélectionner une entreprise
   */
  toggleCompanySelection(companyId: string): void {
    if (this.selectedCompanies.has(companyId)) {
      this.selectedCompanies.delete(companyId);
    } else {
      this.selectedCompanies.add(companyId);
    }
  }

  isCompanySelected(companyId: string): boolean {
    return this.selectedCompanies.has(companyId);
  }

  /**
   * STEP 5: Continuer vers les rendez-vous avec les entreprises sélectionnées
   */
  continueToAppointments(): void {
    if (this.selectedCompanies.size === 0) {
      alert('Veuillez sélectionner au moins une entreprise');
      return;
    }
    
    // Récupérer la première entreprise sélectionnée pour l'affichage
    const firstSelectedId = Array.from(this.selectedCompanies)[0];
    this.selectedCompany = this.matchingResults.find(c => c.companyId === firstSelectedId) || null;
    this.currentStep = 'appointment';
  }

  /**
   * Relancer le matching
   */
  restartMatching(): void {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.selectedCompanies.clear();
        this.showIntroAndStartMatching(user.id);
      }
    });
  }

  /**
   * Sélectionner une entreprise pour voir les détails
   */
  selectCompanyForAppointment(company: CompanyMatchScore): void {
    this.selectedCompany = company;
    this.currentStep = 'appointment';
  }

  /**
   * Retour aux résultats
   */
  backToResults(): void {
    this.currentStep = 'results';
    this.selectedCompany = null;
  }

  /**
   * Passer le matching et aller au dashboard
   */
  skipMatching(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Réserver un entretien
   */
  bookAppointment(jobId: string): void {
    // Rediriger vers la page de réservation d'entretien
    this.router.navigate(['/appointment/book'], {
      queryParams: {
        companyId: this.selectedCompany?.companyId,
        jobId: jobId
      }
    });
  }

  clearError(): void {
    this.store.dispatch(clearError());
  }
}
