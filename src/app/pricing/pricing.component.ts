import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StripeService, StripePlan } from '../services/stripe.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  loading = true;
  error: string | null = null;
  plans: StripePlan[] = [];
  planTab: 'monthly' | 'yearly' = 'monthly';

  constructor(
    private stripeService: StripeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.error = null;

    this.stripeService.getPlans().subscribe({
      next: (response) => {
        this.plans = response.plans;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
        this.error = 'Impossible de charger les plans. Veuillez réessayer.';
        this.loading = false;
      },
    });
  }

  get displayedPlans(): StripePlan[] {
    return this.plans
      .filter((p) => p.interval === (this.planTab === 'monthly' ? 'month' : 'year'))
      .sort((a, b) => a.unit_amount - b.unit_amount);
  }

  formatPrice(plan: StripePlan): string {
    const amount = (plan.unit_amount / 100).toFixed(2);
    const interval = plan.interval === 'month' ? 'mois' : 'an';
    return `${amount}€/${interval}`;
  }

  goRegister(priceId?: string) {
    if (priceId) {
      this.router.navigate(['/authentication/company-register'], {
        queryParams: { priceId },
      });
    } else {
      this.router.navigate(['/authentication/company-register']);
    }
  }
}
