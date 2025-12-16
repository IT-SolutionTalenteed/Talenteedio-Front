import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AvailabilityResponse {
  available: boolean;
  reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = environment.apiBaseUrl; // Utiliser apiBaseUrl qui contient déjà /api
  private useMockData = false; // Désactivé - utiliser les vraies données

  constructor(private http: HttpClient) {}

  /**
   * Vérifier la disponibilité d'un créneau pour un consultant
   */
  checkAvailability(consultantId: string, date: string, time: string): Observable<AvailabilityResponse> {
    if (this.useMockData) {
      return this.getMockAvailability(consultantId, date, time);
    }

    const params = {
      consultantId,
      date,
      time
    };

    const url = `${this.apiUrl}/public/availability`;
    console.log('📡 API Call:', { consultantId, date, time, url, params });

    return this.http.get<AvailabilityResponse>(url, { params });
  }

  /**
   * Mock data pour tester le frontend
   */
  private getMockAvailability(consultantId: string, date: string, time: string): Observable<AvailabilityResponse> {
    return new Observable(observer => {
      // Simuler un délai d'API
      setTimeout(() => {
        // Générer des créneaux non disponibles dynamiquement
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(today.getDate() + 2);

        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        const mockUnavailableSlots = [
          // Aujourd'hui - quelques créneaux pris
          { date: formatDate(today), time: '10:00' },
          { date: formatDate(today), time: '14:00' },
          { date: formatDate(today), time: '15:30' },
          // Demain - quelques créneaux pris
          { date: formatDate(tomorrow), time: '09:00' },
          { date: formatDate(tomorrow), time: '11:00' },
          { date: formatDate(tomorrow), time: '16:00' },
          // Après-demain - quelques créneaux pris
          { date: formatDate(dayAfter), time: '13:00' },
          { date: formatDate(dayAfter), time: '17:00' },
        ];

        const isUnavailable = mockUnavailableSlots.some(slot => 
          slot.date === date && slot.time === time
        );

        // Simuler aussi des créneaux bloqués pour certains consultants
        const isBlocked = consultantId === 'guy' && time === '12:00';

        const response: AvailabilityResponse = {
          available: !isUnavailable && !isBlocked,
          reason: isUnavailable ? 'Créneau déjà réservé' : 
                  isBlocked ? 'Créneau bloqué par le consultant' : undefined
        };

        console.log(`Mock availability for ${consultantId} on ${date} at ${time}:`, response);
        observer.next(response);
        observer.complete();
      }, Math.random() * 300 + 100); // Délai aléatoire entre 100-400ms
    });
  }

  /**
   * Récupérer toutes les dates bloquées d'un consultant
   */
  getBlockedDates(consultantId: string): Observable<{blockedDates: string[]}> {
    if (this.useMockData) {
      return this.getMockBlockedDates(consultantId);
    }

    const params = { consultantId };
    const url = `${this.apiUrl}/public/blocked-dates`;
    console.log('📅 Getting blocked dates:', { consultantId, url });

    return this.http.get<{blockedDates: string[]}>(url, { params });
  }

  /**
   * Mock pour les dates bloquées
   */
  private getMockBlockedDates(consultantId: string): Observable<{blockedDates: string[]}> {
    return new Observable(observer => {
      setTimeout(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(today.getDate() + 2);
        const dayAfter2 = new Date(today);
        dayAfter2.setDate(today.getDate() + 5);
        
        const blockedDates = [
          tomorrow.toISOString().split('T')[0], // Demain bloqué
          dayAfter.toISOString().split('T')[0], // Après-demain bloqué
          dayAfter2.toISOString().split('T')[0], // Dans 5 jours bloqué
        ];

        const response = { blockedDates };
        console.log(`📅 Mock blocked dates for ${consultantId}:`, response);
        observer.next(response);
        observer.complete();
      }, 500); // Délai plus long pour voir l'effet de chargement
    });
  }

  /**
   * Vérifier si une date entière est bloquée
   */
  checkDateBlocked(consultantId: string, date: string): Observable<{blocked: boolean, reason?: string}> {
    if (this.useMockData) {
      return this.getMockDateBlocked(consultantId, date);
    }

    const params = { consultantId, date };
    const url = `${this.apiUrl}/public/date-blocked`;
    console.log('📅 Checking date blocked:', { consultantId, date, url });

    return this.http.get<{blocked: boolean, reason?: string}>(url, { params });
  }

  /**
   * Mock pour les dates bloquées
   */
  private getMockDateBlocked(consultantId: string, date: string): Observable<{blocked: boolean, reason?: string}> {
    return new Observable(observer => {
      setTimeout(() => {
        // Simuler quelques dates bloquées
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const blockedDates = [
          tomorrow.toISOString().split('T')[0], // Demain bloqué
        ];

        const blocked = blockedDates.includes(date);
        const response = {
          blocked,
          reason: blocked ? 'Date bloquée par le consultant' : undefined
        };

        console.log(`Mock date blocked for ${date}:`, response);
        observer.next(response);
        observer.complete();
      }, 100);
    });
  }

  /**
   * Activer/désactiver le mode mock (pour les tests)
   */
  setMockMode(enabled: boolean) {
    this.useMockData = enabled;
    console.log(`Mock mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Vérifier la disponibilité de plusieurs créneaux
   */
  checkMultipleAvailability(consultantId: string, date: string, times: string[]): Observable<{[time: string]: AvailabilityResponse}> {
    const requests = times.map(time => 
      this.checkAvailability(consultantId, date, time)
    );

    return new Observable(observer => {
      Promise.all(requests.map((req, index) => 
        req.toPromise().then(result => ({ time: times[index], result }))
      )).then(results => {
        const availability: {[time: string]: AvailabilityResponse} = {};
        results.forEach(({ time, result }) => {
          availability[time] = result;
        });
        observer.next(availability);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}