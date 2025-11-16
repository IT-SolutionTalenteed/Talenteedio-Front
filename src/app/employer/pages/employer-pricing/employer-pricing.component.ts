import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StripeService, StripePlan } from '../../../services/stripe.service';

@Component({
  selector: 'app-employer-pricing',
  templateUrl: './employer-pricing.component.html',
  styleUrls: ['./employer-pricing.component.scss'],
})
export class EmployerPricingComponent implements OnInit {
  loading = true;
  error: string | null = null;
  plans: StripePlan[] = [];
  planTab: 'monthly' | 'yearly' = 'monthly';
  isProcessing = false;

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

  upgradeToplan(plan: StripePlan) {
    if (this.isProcessing) return;

    this.isProcessing = true;

    const successUrl = `${window.location.origin}/employer?upgrade=success`;
    const cancelUrl = `${window.location.origin}/employer/pricing?upgrade=canceled`;

    this.stripeService
      .createCheckoutSession(plan.price_id, successUrl, cancelUrl)
      .subscribe({
        next: (response) => {
          window.location.href = response.url;
        },
        error: (error) => {
          console.error('Error creating checkout session:', error);
          this.isProcessing = false;
        },
      });
  }

  openPortal() {
    const returnUrl = `${window.location.origin}/employer/pricing`;
    
    this.stripeService.createPortalSession(returnUrl).subscribe({
      next: (response) => {
        window.location.href = response.url;
      },
      error: (error) => {
        console.error('Error creating portal session:', error);
      },
    });
  }
}
