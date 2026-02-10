import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  faFacebookF,
  faLinkedin,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import {
  FACEBOOK_SHARE_BASE_URL,
  LINKEDIN_SHARE_BASE_URL,
  TWITTER_SHARE_BASE_URL,
} from 'src/app/shared/constants/shared.constant';
import { Event } from 'src/app/shared/models/event.interface';
import { User } from 'src/app/shared/models/user.interface';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnChanges, OnInit {
  @Input() event: Event;
  icon = faCircleUser;
  fbIcon = faFacebookF;
  twitterIcon = faXTwitter;
  linkedinIcon = faLinkedin;
  content: SafeHtml;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  
  currentUser$: Observable<User>;
  currentUser: User | null = null;
  participationStatus: any = null;
  showReservationModal = false;
  showParticipationModal = false;
  selectedCompanyStands: any[] = [];
  reservationNotes = '';
  participationMessage = '';
  isLoading = false;

  constructor(
    private sanitizer: DomSanitizer, 
    private location: Location,
    private store: Store,
    private eventService: EventService,
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      this.facebookUrl =
        FACEBOOK_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.twitterUrl =
        TWITTER_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.linkedinUrl =
        LINKEDIN_SHARE_BASE_URL + window.location.origin + this.location.path();
    }
  }

  ngOnInit(): void {
    this.currentUser$ = this.store.pipe(select(getLoggedUser));
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && this.event) {
        this.loadParticipationStatus();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        this.event?.content ?? ''
      );
      if (this.currentUser && this.event) {
        this.loadParticipationStatus();
      }
    }
  }

  loadParticipationStatus(): void {
    if (!this.event?.id) return;
    
    this.eventService.getMyEventParticipationStatus(this.event.id).subscribe({
      next: (status) => {
        this.participationStatus = status;
      },
      error: (error) => {
        console.error('Error loading participation status:', error);
      }
    });
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.roles?.some(role => role.name === 'admin') || false;
  }

  get isCompany(): boolean {
    return this.currentUser?.company != null;
  }

  get isRegularUser(): boolean {
    return this.isAuthenticated && !this.isAdmin && !this.isCompany;
  }

  get shouldShowCTA(): boolean {
    if (!this.isAuthenticated) return true;
    if (this.isAdmin) return false;
    if (this.isCompany) {
      return !this.participationStatus?.isOwner && !this.participationStatus?.isParticipating;
    }
    return this.isRegularUser;
  }

  get ctaButtonText(): string {
    if (!this.isAuthenticated) return 'Connectez-vous pour participer';
    if (this.isCompany) {
      if (this.participationStatus?.hasRequestedParticipation) {
        const status = this.participationStatus.participationRequestStatus;
        if (status === 'PENDING') return 'Demande en attente';
        if (status === 'REJECTED') return 'Demande refusée';
      }
      return 'Demander une participation';
    }
    if (this.isRegularUser) {
      if (this.participationStatus?.userReservations?.length > 0) {
        const count = this.participationStatus.userReservations.length;
        return count === 1 ? 'Réservation confirmée' : `${count} réservations confirmées`;
      }
      return 'Réserver ma place';
    }
    return 'Learn More';
  }

  get ctaButtonDisabled(): boolean {
    if (this.isCompany && this.participationStatus?.hasRequestedParticipation) {
      return this.participationStatus.participationRequestStatus === 'PENDING';
    }
    if (this.isRegularUser && this.participationStatus?.userReservations?.length > 0) {
      return false; // Permettre de réserver d'autres stands
    }
    return false;
  }

  handleCTAClick(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/authentication/login']);
      return;
    }

    if (this.isCompany) {
      this.showParticipationModal = true;
    } else if (this.isRegularUser) {
      if (!this.event.companies || this.event.companies.length === 0) {
        alert('Aucune entreprise ne participe encore à cet événement.');
        return;
      }
      this.showReservationModal = true;
    }
  }

  closeReservationModal(): void {
    this.showReservationModal = false;
    this.selectedCompanyStands = [];
    this.reservationNotes = '';
  }

  closeParticipationModal(): void {
    this.showParticipationModal = false;
    this.participationMessage = '';
  }

  toggleCompanySelection(company: any): void {
    const index = this.selectedCompanyStands.findIndex(c => c.id === company.id);
    if (index > -1) {
      this.selectedCompanyStands.splice(index, 1);
    } else {
      // Vérifier si l'utilisateur a déjà une réservation pour ce stand
      const alreadyReserved = this.participationStatus?.userReservations?.some(
        (r: any) => r.companyStand.id === company.id
      );
      if (!alreadyReserved) {
        this.selectedCompanyStands.push(company);
      }
    }
  }

  isCompanySelected(company: any): boolean {
    return this.selectedCompanyStands.some(c => c.id === company.id);
  }

  isCompanyAlreadyReserved(company: any): boolean {
    return this.participationStatus?.userReservations?.some(
      (r: any) => r.companyStand.id === company.id
    ) || false;
  }

  submitReservation(): void {
    if (!this.selectedCompanyStands || this.selectedCompanyStands.length === 0) {
      alert('Veuillez sélectionner au moins une entreprise.');
      return;
    }

    this.isLoading = true;
    const companyStandIds = this.selectedCompanyStands.map(c => c.id);
    
    this.eventService.createMultipleEventReservations(
      this.event.id,
      companyStandIds,
      this.reservationNotes
    ).subscribe({
      next: (reservations) => {
        const count = reservations.length;
        alert(`${count} réservation${count > 1 ? 's' : ''} confirmée${count > 1 ? 's' : ''} avec succès!`);
        this.closeReservationModal();
        this.loadParticipationStatus();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating reservations:', error);
        alert(error.message || 'Une erreur est survenue lors de la réservation.');
        this.isLoading = false;
      }
    });
  }

  submitParticipationRequest(): void {
    this.isLoading = true;
    this.eventService.requestEventParticipation(
      this.event.id,
      this.participationMessage
    ).subscribe({
      next: () => {
        alert('Votre demande de participation a été envoyée avec succès!');
        this.closeParticipationModal();
        this.loadParticipationStatus();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error requesting participation:', error);
        alert(error.message || 'Une erreur est survenue lors de l\'envoi de la demande.');
        this.isLoading = false;
      }
    });
  }

  cancelReservation(): void {
    if (!this.participationStatus?.userReservation?.id) return;

    if (!confirm('Êtes-vous sûr de vouloir annuler votre réservation?')) return;

    this.isLoading = true;
    this.eventService.cancelEventReservation(
      this.participationStatus.userReservation.id
    ).subscribe({
      next: () => {
        alert('Votre réservation a été annulée.');
        this.loadParticipationStatus();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error canceling reservation:', error);
        alert(error.message || 'Une erreur est survenue lors de l\'annulation.');
        this.isLoading = false;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openWindow(event: any, link) {
    event.preventDefault(); // Prevent the default link behavior
    window.open(link, '_blank');
  }

  getCompanyColor(company: any): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
    ];
    const index = company.company_name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getCompanyColorDark(company: any): string {
    const colorsDark = [
      '#EE5A6F', '#44B8AC', '#3FA5BD', '#FF8E5A', '#7FC4B0',
      '#E5CA5D', '#A87DB8', '#6FAFD0', '#E6A527', '#3FA070'
    ];
    const index = company.company_name.charCodeAt(0) % colorsDark.length;
    return colorsDark[index];
  }
}
