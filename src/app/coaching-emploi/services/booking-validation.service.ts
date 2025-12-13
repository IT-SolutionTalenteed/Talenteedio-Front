import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface BookingDetails {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceTitle: string;
  bookingDate: string;
  bookingTime: string;
  timezone: string;
  amount: number;
  status: string;
  paymentStatus: string;
  consultant?: any;
}

export interface ValidationRequest {
  action: 'confirm' | 'reject';
  message?: string;
}

export interface ValidationResponse {
  success: boolean;
  booking?: {
    id: string;
    status: string;
    notes: string;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingValidationService {
  constructor(private http: HttpClient) {}

  getBookingDetails(bookingId: string): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(
      `${environment.apiBaseUrl}/booking-validation/${bookingId}`
    );
  }

  validateBooking(
    bookingId: string,
    request: ValidationRequest
  ): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(
      `${environment.apiBaseUrl}/booking-validation/${bookingId}/validate`,
      request
    );
  }
}