import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingValidationService, BookingDetails } from '../../services/booking-validation.service';

@Component({
  selector: 'app-booking-validation',
  templateUrl: './booking-validation.component.html',
  styleUrls: ['./booking-validation.component.scss'],
})
export class BookingValidationComponent implements OnInit {
  bookingId: string;
  action: 'confirm' | 'reject' | null = null;
  loading = false;
  success = false;
  error: string | null = null;
  consultantMessage = '';
  bookingDetails: BookingDetails | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingValidationService: BookingValidationService
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    const actionParam = this.route.snapshot.queryParamMap.get('action') as 'confirm' | 'reject' | null;
    
    // Si pas d'action spécifiée, on assume que c'est une confirmation
    this.action = actionParam || 'confirm';
    
    if (!this.bookingId) {
      this.error = 'Paramètres de validation invalides';
      return;
    }

    // Charger les détails de la réservation
    this.loadBookingDetails();
  }

  loadBookingDetails(): void {
    this.loading = true;
    
    this.bookingValidationService.getBookingDetails(this.bookingId).subscribe({
      next: (details) => {
        this.bookingDetails = details;
        this.loading = false;
        
        // Vérifier si la réservation peut encore être validée
        if (details.status !== 'awaiting_validation') {
          this.error = 'Cette réservation ne peut plus être validée';
        }
      },
      error: (error) => {
        console.error('Error loading booking details:', error);
        this.error = 'Impossible de charger les détails de la réservation';
        this.loading = false;
      }
    });
  }

  validateBooking(): void {
    if (!this.bookingId || !this.action) {
      this.error = 'Paramètres manquants';
      return;
    }

    this.loading = true;
    this.error = null;

    const request = {
      action: this.action,
      message: this.consultantMessage.trim() || undefined
    };

    this.bookingValidationService.validateBooking(this.bookingId, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = true;
          this.loading = false;

          // Rediriger après 3 secondes
          setTimeout(() => {
            this.router.navigate(['/coaching-emploi']);
          }, 3000);
        } else {
          this.error = response.error || 'Erreur lors de la validation';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error validating booking:', error);
        this.error = 'Erreur lors de la validation';
        this.loading = false;
      }
    });
  }

  get actionText(): string {
    return this.action === 'confirm' ? 'Confirmer' : 'Refuser';
  }

  get actionClass(): string {
    return this.action === 'confirm' ? 'confirm' : 'reject';
  }
}