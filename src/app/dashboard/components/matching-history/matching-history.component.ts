import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchingProfileService } from 'src/app/matching-profile/services/matching-profile.service';

@Component({
  selector: 'app-matching-history',
  templateUrl: './matching-history.component.html',
  styleUrls: ['./matching-history.component.scss']
})
export class MatchingHistoryComponent implements OnInit {
  matchingProfiles: any[] = [];
  appointments: any[] = [];
  loading = false;
  error: string | null = null;
  activeTab: 'matchings' | 'appointments' = 'matchings';

  constructor(
    private matchingProfileService: MatchingProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMatchingHistory();
    this.loadAppointments();
  }

  loadMatchingHistory(): void {
    this.loading = true;
    this.matchingProfileService.getMyMatchingProfiles().subscribe({
      next: (profiles) => {
        this.matchingProfiles = profiles.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading matching history:', err);
        this.error = 'Erreur lors du chargement de l\'historique';
        this.loading = false;
      }
    });
  }

  loadAppointments(): void {
    this.matchingProfileService.getMyAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments.sort((a, b) => 
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
        );
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
      }
    });
  }

  viewMatching(profileId: string): void {
    this.router.navigate(['/matching-profile'], { queryParams: { profileId } });
  }

  startNewMatching(): void {
    this.router.navigate(['/matching-profile']);
  }

  getStatusLabel(status: string): string {
    const labels = {
      'DRAFT': 'Brouillon',
      'ACTIVE': 'Actif',
      'COMPLETED': 'Terminé',
      'ARCHIVED': 'Archivé'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes = {
      'DRAFT': 'badge-secondary',
      'ACTIVE': 'badge-primary',
      'COMPLETED': 'badge-success',
      'ARCHIVED': 'badge-warning'
    };
    return classes[status] || 'badge-secondary';
  }

  getAppointmentStatusLabel(status: string): string {
    const labels = {
      'PENDING': 'En attente',
      'CONFIRMED': 'Confirmé',
      'CANCELLED': 'Annulé',
      'COMPLETED': 'Terminé'
    };
    return labels[status] || status;
  }

  getAppointmentStatusClass(status: string): string {
    const classes = {
      'PENDING': 'badge-warning',
      'CONFIRMED': 'badge-success',
      'CANCELLED': 'badge-danger',
      'COMPLETED': 'badge-info'
    };
    return classes[status] || 'badge-secondary';
  }
}
