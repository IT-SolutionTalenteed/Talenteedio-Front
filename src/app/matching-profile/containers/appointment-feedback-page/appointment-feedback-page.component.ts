import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchingProfileService } from '../../services/matching-profile.service';

@Component({
  selector: 'app-appointment-feedback-page',
  templateUrl: './appointment-feedback-page.component.html',
  styleUrls: ['./appointment-feedback-page.component.scss']
})
export class AppointmentFeedbackPageComponent implements OnInit {
  appointmentId: string | null = null;
  appointment: any = null;
  loading = true;
  error: string | null = null;
  feedbackSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchingProfileService: MatchingProfileService
  ) {}

  ngOnInit() {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    
    if (!this.appointmentId) {
      this.error = 'ID d\'entretien manquant';
      this.loading = false;
      return;
    }

    this.loadAppointment();
  }

  loadAppointment() {
    if (!this.appointmentId) return;

    this.loading = true;
    this.matchingProfileService.getMyAppointments().subscribe({
      next: (appointments) => {
        this.appointment = appointments.find((apt: any) => apt.id === this.appointmentId);
        
        if (!this.appointment) {
          this.error = 'Entretien introuvable';
        } else if (this.appointment.feedbackSubmitted) {
          this.feedbackSubmitted = true;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.error = 'Erreur lors du chargement de l\'entretien';
        this.loading = false;
      }
    });
  }

  onFeedbackSubmitted(feedback: any) {
    this.feedbackSubmitted = true;
    this.appointment = { ...this.appointment, ...feedback };
  }

  goToAppointments() {
    this.router.navigate(['/matching-profile/appointments']);
  }

  formatDate(date: string): string {
    // Créer la date en utilisant le format ISO pour éviter les problèmes de timezone
    const dateObj = new Date(date + 'T00:00:00');
    return dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
