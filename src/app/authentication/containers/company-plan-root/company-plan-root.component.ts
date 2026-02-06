import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyPlanService, CompanyPlan } from '../../services/company-plan.service';

@Component({
  selector: 'app-company-plan-root',
  templateUrl: './company-plan-root.component.html',
  styleUrls: ['./company-plan-root.component.scss'],
})
export class CompanyPlanRootComponent implements OnInit {
  plans: CompanyPlan[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private companyPlanService: CompanyPlanService
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.companyPlanService.getActiveCompanyPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
        this.error = 'Impossible de charger les plans. Veuillez réessayer.';
        this.loading = false;
      },
    });
  }

  selectPlan(planId: string) {
    this.router.navigate(['/authentication/company-contact'], {
      queryParams: { planId },
    });
  }

  formatLimit(limit: number): string {
    return limit === -1 ? 'Illimité' : limit.toString();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
}

