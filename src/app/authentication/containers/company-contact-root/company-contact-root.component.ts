import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyPlanService, CompanyPlan } from '../../services/company-plan.service';
import { CompanyRegistrationService } from '../../services/company-registration.service';

@Component({
  selector: 'app-company-contact-root',
  templateUrl: './company-contact-root.component.html',
  styleUrls: ['./company-contact-root.component.scss'],
})
export class CompanyContactRootComponent implements OnInit {
  contactForm: FormGroup;
  selectedPlan: CompanyPlan | null = null;
  planId: string | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyPlanService: CompanyPlanService,
    private companyRegistrationService: CompanyRegistrationService
  ) {
    this.contactForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      website: [''],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.planId = params['planId'];
      if (this.planId) {
        this.loadPlan(this.planId);
      } else {
        this.router.navigate(['/authentication/company-plan']);
      }
    });
  }

  loadPlan(planId: string) {
    this.loading = true;
    this.companyPlanService.getCompanyPlan(planId).subscribe({
      next: (plan) => {
        this.selectedPlan = plan;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plan:', error);
        this.error = 'Impossible de charger le plan sélectionné.';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.contactForm.invalid || !this.planId) {
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = null;

    const formData = {
      ...this.contactForm.value,
      planId: this.planId,
    };

    this.companyRegistrationService.registerCompany(formData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.router.navigate(['/authentication/company-registration-success']);
      },
      error: (error) => {
        console.error('Error submitting registration:', error);
        this.error =
          error.error?.message ||
          'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        this.submitting = false;
      },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  goBack() {
    this.router.navigate(['/authentication/company-plan']);
  }
}
