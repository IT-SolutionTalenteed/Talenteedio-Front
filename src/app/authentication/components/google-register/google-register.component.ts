import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-google-register',
  templateUrl: './google-register.component.html',
  styleUrls: ['./google-register.component.scss']
})
export class GoogleRegisterComponent {
  @Input() googleData: any;
  @Input() credential: string = '';
  @Output() registrationComplete = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  roles = [
    { value: 'talent', label: 'Talent' },
    { value: 'company', label: 'Entreprise' },
    { value: 'consultant', label: 'Consultant' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.registerForm = this.fb.group({
      role: ['', Validators.required],
      phone: ['', Validators.required],
      company_name: [''],
      values: [[]]
    });
  }

  ngOnInit() {
    // Pré-remplir avec les données Google
    if (this.googleData) {
      console.log('Google data received:', this.googleData);
    }
  }

  onRoleChange() {
    const role = this.registerForm.get('role')?.value;
    
    // Réinitialiser les validateurs
    this.registerForm.get('company_name')?.clearValidators();
    this.registerForm.get('values')?.clearValidators();

    // Ajouter les validateurs selon le rôle
    if (role === 'company') {
      this.registerForm.get('company_name')?.setValidators([Validators.required]);
    } else if (role === 'talent') {
      this.registerForm.get('values')?.setValidators([Validators.required]);
    }

    // Mettre à jour la validation
    this.registerForm.get('company_name')?.updateValueAndValidity();
    this.registerForm.get('values')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid && this.credential) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.registerForm.value;
      const additionalData = {
        phone: formData.phone,
        ...(formData.company_name && { company_name: formData.company_name }),
        ...(formData.values && formData.values.length > 0 && { values: formData.values })
      };

      this.authService.googleRegister(this.credential, formData.role, additionalData)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.registrationComplete.emit(response);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Erreur lors de l\'inscription';
            console.error('Registration error:', error);
          }
        });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}