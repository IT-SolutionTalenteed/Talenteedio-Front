import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface CompanyPlan {
  id: string;
  title: string;
  description: string;
  features: string[];
  maxArticles: number;
  maxEvents: number;
  maxJobs: number;
  price: number;
  billingPeriod: string;
  isActive: boolean;
  displayOrder: number;
  isPopular: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyPlanService {
  private apiUrl = `${environment.apiBaseUrl}/company-plan`;

  constructor(private http: HttpClient) {}

  getActiveCompanyPlans(): Observable<CompanyPlan[]> {
    const query = `
      query GetActiveCompanyPlans {
        getActiveCompanyPlans {
          id
          title
          description
          features
          maxArticles
          maxEvents
          maxJobs
          price
          billingPeriod
          isActive
          displayOrder
          isPopular
        }
      }
    `;

    return this.http
      .post<{ data: { getActiveCompanyPlans: CompanyPlan[] } }>(this.apiUrl, {
        query,
      })
      .pipe(map((response) => response.data.getActiveCompanyPlans));
  }

  getCompanyPlan(id: string): Observable<CompanyPlan> {
    const query = `
      query GetOneCompanyPlan($id: String!) {
        getOneCompanyPlan(id: $id) {
          id
          title
          description
          features
          maxArticles
          maxEvents
          maxJobs
          price
          billingPeriod
          isActive
          displayOrder
          isPopular
        }
      }
    `;

    return this.http
      .post<{ data: { getOneCompanyPlan: CompanyPlan } }>(this.apiUrl, {
        query,
        variables: { id },
      })
      .pipe(map((response) => response.data.getOneCompanyPlan));
  }
}
