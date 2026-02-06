import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface CompanyRegistrationData {
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website?: string;
  description?: string;
  planId: string;
}

export interface CompanyRegistrationResponse {
  success: boolean;
  message: string;
  companyId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyRegistrationService {
  private apiUrl = `${environment.apiBaseUrl}/company`;

  constructor(private http: HttpClient) {}

  registerCompany(data: CompanyRegistrationData): Observable<CompanyRegistrationResponse> {
    const mutation = `
      mutation RegisterCompany($input: CompanyRegistrationInput!) {
        registerCompany(input: $input) {
          success
          message
          companyId
        }
      }
    `;

    return this.http
      .post<{ data: { registerCompany: CompanyRegistrationResponse } }>(this.apiUrl, {
        query: mutation,
        variables: { input: data },
      })
      .pipe(map((response) => response.data.registerCompany));
  }
}
