import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Pricing {
  id: string;
  title: string;
  description: string;
  price: number;
  unit?: string;
  duration?: string;
  features?: string[];
  consultant?: {
    id: string;
    user: {
      firstname: string;
      lastname: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PricingList {
  rows: Pricing[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPricingsByConsultant(consultantId: string): Observable<{ data: { result: PricingList } }> {
    const query = `
      query GetPricings($consultantId: ID!) {
        result: getPricings(consultantId: $consultantId) {
          rows {
            id
            title
            description
            price
            unit
            duration
            features
            consultant {
              id
              user {
                firstname
                lastname
              }
            }
            createdAt
            updatedAt
          }
          count
        }
      }
    `;

    return this.http.post<{ data: { result: PricingList } }>(`${this.apiUrl}/api/pricing`, {
      query,
      variables: { consultantId }
    });
  }

  getAllPricings(): Observable<{ data: { result: Pricing[] } }> {
    const query = `
      query GetAllPricings {
        result: getAllPricings {
          id
          title
          description
          price
          unit
          duration
          features
          consultant {
            id
            user {
              firstname
              lastname
            }
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.http.post<{ data: { result: Pricing[] } }>(`${this.apiUrl}/api/pricing`, {
      query,
      variables: {}
    });
  }
}