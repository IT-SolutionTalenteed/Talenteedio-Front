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
import { Observable } from 'rxjs';
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

  workModes$: Observable<any[]>;
  jobTypes$: Observable<any[]>;
  categories$: Observable<any[]>;

  config = PHONE_CONFIG;

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  form: FormGroup;
  customErrorLabels: Record<string, string> = {
    email: 'Invalid email',
    invalidPhones: 'Invalid phone numbers',
  };

  today = new Date();
  countries = ALL_COUNTRIES.map((it) => it.name);
  cv: File;
  profilePictureId: string | null = null;
  profilePictureUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private gaService: GoogleAnalyticsService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // Charger les données dynamiques
    this.loadDynamicData();

    if (!this.form) {
      this.form = this.initForm(EMPTY_USER);

      // Définir le rôle par défaut à "talent"
      this.form.patchValue({ role: this.roleNameTalent });

      // Le consentement est obligatoire pour les talents
      const consentControl = this.form.get('consent');
      consentControl.setValidators([Validators.required]);
      consentControl.updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    this.setFocusOnFirstInput();
    this.isWindowLoaded = typeof window !== 'undefined';
  }

  onCvChange(event) {
    this.cv = event.target.files[0];
    
    // Auto-remplissage du formulaire à partir du CV
    if (this.cv) {
      this.extractDataFromCV(this.cv);
    }
  }

  private extractDataFromCV(file: File): void {
    // Créer un FormData pour envoyer le fichier au backend
    const formData = new FormData();
    formData.append('cv', file);

    // Appeler le service d'extraction de données du CV
    this.authenticationService.extractCVData(formData).subscribe({
      next: (response) => {
        if (response && response.data) {
          const extractedData = response.data;
          
          // Auto-remplir les champs du formulaire
          const updates: any = {};
          
          if (extractedData.skills && extractedData.skills.length > 0) {
            updates.competences = extractedData.skills.join(', ');
          }
          
          if (extractedData.languages && extractedData.languages.length > 0) {
            updates.languages = extractedData.languages.join(', ');
          }
          
          if (extractedData.interests && extractedData.interests.length > 0) {
            updates.interests = extractedData.interests.join(', ');
          }
          
          if (extractedData.education && extractedData.education.length > 0) {
            updates.formations = extractedData.education.join(', ');
          }
          
          if (extractedData.experience) {
            updates.yearsOfExperience = extractedData.experience;
          }
          
          if (extractedData.position) {
            updates.desiredPosition = extractedData.position;
          }

          // Appliquer les mises à jour au formulaire
          this.form.patchValue(updates);
          
          // Afficher un message de succès
          console.log('CV data extracted and form auto-filled successfully');
        }
      },
      error: (error) => {
        console.error('Error extracting CV data:', error);
        // Continuer même si l'extraction échoue
      }
    });
  }

  onProfilePictureChanged(pictureId: string) {
    this.profilePictureId = pictureId;
  }

  onProfilePictureRemoved() {
    this.profilePictureId = null;
    this.profilePictureUrl = null;
  }

  onSubmit(form: FormGroup) {
    const user = form.value as User;
    const userData: any = {
      ...user,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      phone: (user.phone as any).internationalNumber,
      profilePicture: this.profilePictureId ? { id: this.profilePictureId } : null,
      role: RoleName.TALENT // Forcer le rôle à "talent"
    };

    // Si un CV est fourni, l'uploader d'abord
    if (this.cv) {
      this.form.valid
        ? this.authenticationService
          .uploadMedia(this.cv, 'pdf')
          .subscribe((res) => {
            this.save.emit({
              ...userData,
              cvId: res.data.result.id,
            });
          })
        : this.showErrors();
    } else {
      // Pas de CV, envoyer directement
      this.form.valid
        ? this.save.emit(userData)
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
        role: [RoleName.TALENT], // Toujours "talent" par défaut
        values: [user.values],
        cv: [null, this.cvValidator],
        firstname: [user.firstname, Validators.required],
        lastname: [user.lastname, Validators.required],
        password: [user.password, Validators.required],
        confirmationPassword: [''],
        recaptcha: [undefined, Validators.required],
        consent: [false, Validators.required], // Obligatoire pour les talents
        phone: [user.phone, Validators.compose([Validators.required])],
        // Champs existants
        tjm: [null],
        annualSalary: [null],
        mobility: [null],
        availabilityDate: [null],
        desiredLocation: [null],
        workMode: [null],
        // Nouveaux champs pour l'inscription
        yearsOfExperience: [null],
        competences: [null],
        languages: [null],
        country: [null],
        city: [null],
        address: [null],
        postalCode: [null],
        formations: [null],
        salaryRange: [null],
        interests: [null],
        desiredWorkLocation: [null],
        desiredContractType: [null],
        desiredPosition: [null],
        desiredCompanyType: [null],
        desiredSector: [[]],
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

  private loadDynamicData(): void {
    // Charger les work modes (statique selon l'enum du backend)
    this.workModes$ = new Observable(subscriber => {
      subscriber.next([
        { name: 'remote' },
        { name: 'hybrid' },
        { name: 'onsite' }
      ] as any);
      subscriber.complete();
    });

    // Charger les job types (types de contrat)
    this.jobTypes$ = this.authenticationService.getJobTypes({
      input: { limit: 100, page: 1 },
      filter: { status: 'public' }
    });

    // Charger les catégories
    this.categories$ = this.authenticationService.getCategories({
      input: { limit: 100, page: 1 },
      filter: { status: 'public' }
    });
  }

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
