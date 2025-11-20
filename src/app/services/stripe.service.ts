import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface StripePlan {
  price_id: string;
  currency: string;
  unit_amount: number;
  interval: string;
  interval_count: number;
  trial_period_days: number | null;
  product: {
    id: string;
    name: string;
    description: string;
    images: string[];
    metadata: Record<string, string>;
  };
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

export interface PortalSessionResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des plans disponibles
   */
  getPlans(): Observable<{ plans: StripePlan[] }> {
    return this.http.get<{ plans: StripePlan[] }>(
      `${environment.apiBaseUrl}/billing/plans`
    );
  }

  /**
   * Crée une session de checkout Stripe
   */
  createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    email?: string
  ): Observable<CheckoutSessionResponse> {
    return this.http.post<CheckoutSessionResponse>(
      `${environment.apiBaseUrl}/billing/checkout-session`,
      {
        price_id: priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(email ? { email } : {}),
      }
    );
  }

  /**
   * Crée une session pour le portail client Stripe
   */
  createPortalSession(returnUrl: string): Observable<PortalSessionResponse> {
    return this.http.post<PortalSessionResponse>(
      `${environment.apiBaseUrl}/billing/portal-session`,
      {
        return_url: returnUrl,
      }
    );
  }

  /**
   * Crée une session de checkout pour le coaching emploi
   */
  createCoachingCheckoutSession(data: {
    contact: { name: string; email: string; phone: string };
    consultant: string;
    service: string;
    date: string;
    time: string;
    frequency?: string;
    amount: number;
  }): Observable<CheckoutSessionResponse> {
    const successUrl = `${window.location.origin}/coaching-emploi/success`;
    const cancelUrl = `${window.location.origin}/coaching-emploi/services/${data.consultant}`;

    return this.http.post<CheckoutSessionResponse>(
      `${environment.apiBaseUrl}/billing/coaching-checkout`,
      {
        ...data,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }
    );
  }
}
