import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyRegistrationService } from '../../services/company-registration.service';

@Component({
  selector: 'app-company-plan-root',
  templateUrl: './company-plan-root.component.html',
  styleUrls: ['./company-plan-root.component.scss'],
})
export class CompanyPlanRootComponent implements OnInit {
  contactForm: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyRegistrationService: CompanyRegistrationService
  ) {
    this.contactForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      website: [''],
      description: ['', [Validators.maxLength(500)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Pré-remplir l'email si disponible dans localStorage
    try {
      const savedEmail = localStorage.getItem('company_onboarding_email');
      if (savedEmail) {
        this.contactForm.patchValue({ email: savedEmail });
      }
    } catch {}
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.contactForm.value;
    
    // Créer les données d'inscription avec un planId par défaut
    const registrationData = {
      ...formValue,
      planId: 'default', // Plan par défaut, sera géré par l'équipe
    };

    this.companyRegistrationService.registerCompany(registrationData).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/authentication/company-registration-success']);
      },
      error: (error) => {
        console.error('Error submitting contact:', error);
        this.error = 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.';
        this.submitting = false;
      },
    });
  }
}

