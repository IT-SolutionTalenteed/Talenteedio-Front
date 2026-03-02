import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

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

    this.completedAppointments = this.appointments.filter((apt) => {
      return apt.status === 'completed';
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
    return new Date(date).toLocaleDateString('fr-FR', {
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
