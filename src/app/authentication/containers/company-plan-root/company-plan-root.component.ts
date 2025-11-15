import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from 'src/app/routeur/store/actions/router.actions';

type Plan = {
  id: string;
  title: string;
  price: string;
  perks: string[];
};

@Component({
  selector: 'app-company-plan-root',
  templateUrl: './company-plan-root.component.html',
  styleUrls: ['./company-plan-root.component.scss'],
})
export class CompanyPlanRootComponent {
  plans: Plan[] = [
    {
      id: 'starter',
      title: 'Starter',
      price: 'Gratuit',
      perks: ['1 offre active', 'Visibilité standard', 'Support email'],
    },
    {
      id: 'pro',
      title: 'Pro',
      price: '49€/mois',
      perks: ['5 offres actives', 'Mise en avant', 'Support prioritaire'],
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      price: 'Sur mesure',
      perks: ['Offres illimitées', 'Marque employeur', 'Success manager'],
    },
  ];

  constructor(private store: Store) {}

  select(plan: Plan) {
    // Persist selection locally for now
    try {
      localStorage.setItem('company_selected_plan', plan.id);
    } catch {}
    this.store.dispatch(go({ path: ['/home'] }));
  }
}

