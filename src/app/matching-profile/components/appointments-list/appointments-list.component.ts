import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';

const GET_MY_APPOINTMENTS = gql`
  query GetMyAppointments {
    getMyAppointments {
      id
      appointmentDate
      appointmentTime
      timezone
      status
      message
      company {
        id
        company_name
        logo {
          fileUrl
        }
      }
      feedbackSubmitted
      candidateFeedback
      candidateDecision
      candidateRating
      feedbackSubmittedAt
    }
  }
`;

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
})
export class AppointmentsListComponent implements OnInit {
  appointments: any[] = [];
  upcomingAppointments: any[] = [];
  completedAppointments: any[] = [];
  selectedAppointmentForFeedback: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.checkFeedbackParam();
  }

  loadAppointments() {
    this.loading = true;
    this.apollo
      .query({
        query: GET_MY_APPOINTMENTS,
        fetchPolicy: 'network-only',
        context: {
          uri: `${environment.apiBaseUrl}/matching-profile`,
        },
      })
      .subscribe({
        next: (result: any) => {
          this.appointments = result.data.getMyAppointments;
          this.separateAppointments();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.error = 'Erreur lors du chargement des rendez-vous';
          this.loading = false;
        },
      });
  }

  separateAppointments() {
    const now = new Date();

    this.upcomingAppointments = this.appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return (
        (apt.status === 'confirmed' || apt.status === 'pending') &&
        aptDate >= now
      );
    });

    // Les entretiens terminés sont soit :
    // 1. Marqués explicitement comme 'completed'
    // 2. Confirmés mais dont la date est passée
    this.completedAppointments = this.appointments.filter((apt) => {
      if (apt.status === 'completed') {
        return true;
      }
      
      // Si l'entretien est confirmé et que la date est passée
      if (apt.status === 'confirmed') {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate < now;
      }
      
      return false;
    });
  }

  checkFeedbackParam() {
    this.route.queryParams.subscribe((params) => {
      if (params['feedback']) {
        const appointmentId = params['feedback'];
        const appointment = this.appointments.find(
          (apt) => apt.id === appointmentId
        );

        if (appointment && !appointment.feedbackSubmitted) {
          this.openFeedbackForm(appointment);
        }
      }
    });
  }

  openFeedbackForm(appointment: any) {
    this.selectedAppointmentForFeedback = appointment;
  }

  onFeedbackSubmitted(feedback: any) {
    this.loadAppointments();
    this.selectedAppointmentForFeedback = null;
  }

  onFeedbackCancelled() {
    this.selectedAppointmentForFeedback = null;
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      rejected: 'Rejeté',
      cancelled: 'Annulé',
      completed: 'Terminé',
    };
    return labels[status] || status;
  }
}
