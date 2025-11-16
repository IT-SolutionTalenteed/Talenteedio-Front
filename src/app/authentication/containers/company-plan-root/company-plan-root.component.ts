import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { StripeService, StripePlan } from 'src/app/services/stripe.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-plan-root',
  templateUrl: './company-plan-root.component.html',
  styleUrls: ['./company-plan-root.component.scss'],
})
export class CompanyPlanRootComponent implements OnInit {
  plans: StripePlan[] = [];
  loading = true;
  error: string | null = null;
  isProcessing = false;

  constructor(
    private store: Store,
    private stripeService: StripeService
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
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

  select(plan: StripePlan) {
    if (this.isProcessing) return;

    // Si c'est le plan gratuit (Starter), rediriger directement vers home
    if (plan.unit_amount === 0) {
      try {
        localStorage.setItem('company_selected_plan', 'starter');
      } catch {}
      this.store.dispatch(go({ path: ['/home'] }));
      return;
    }

    this.isProcessing = true;

    // Créer une session de checkout Stripe
    const successUrl = `${window.location.origin}/home?payment=success`;
    const cancelUrl = `${window.location.origin}/authentication/company-plan?payment=canceled`;

    this.stripeService
      .createCheckoutSession(plan.price_id, successUrl, cancelUrl)
      .subscribe({
        next: (response) => {
          // Rediriger vers Stripe Checkout
          window.location.href = response.url;
        },
        error: (error) => {
          console.error('Error creating checkout session:', error);
          alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.');
          this.isProcessing = false;
        },
      });
  }

  formatPrice(plan: StripePlan): string {
    if (plan.unit_amount === 0) {
      return 'Gratuit';
    }

    const amount = plan.unit_amount / 100;
    const currency = plan.currency === 'EUR' ? '€' : plan.currency;
    const interval = plan.interval === 'month' ? 'mois' : 'an';

    return `${amount}${currency}/${interval}`;
  }
}

