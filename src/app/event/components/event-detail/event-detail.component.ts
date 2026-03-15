import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
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
import { MatchingProfileService } from 'src/app/matching-profile/services/matching-profile.service';
import { FeaturedEventMatchingService } from '../../services/featured-event-matching.service';

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

  // Featured event matching workflow
  showAuthModal = false;
  currentStep: 'auth' | 'profile' | 'matching' | 'results' | 'appointments' = 'auth';
  currentProfile: any = null;
  matchedCompanies: any[] = [];
  matchedJobs: any[] = [];
  selectedCompanies: any[] = [];
  loadingMatching = false;
  matchingError: string | null = null;
  hasAttemptedMatching = false;

  constructor(
    private sanitizer: DomSanitizer, 
    private location: Location,
    private store: Store,
    private eventService: EventService,
    private router: Router,
    private matchingProfileService: MatchingProfileService,
    private featuredEventMatchingService: FeaturedEventMatchingService
  ) {}

  /**
   * Met à jour les URLs de partage avec l'URL actuelle
   */
  private updateShareUrls(): void {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.origin + this.location.path();
      this.facebookUrl = FACEBOOK_SHARE_BASE_URL + encodeURIComponent(currentUrl);
      this.twitterUrl = TWITTER_SHARE_BASE_URL + encodeURIComponent(currentUrl);
      this.linkedinUrl = LINKEDIN_SHARE_BASE_URL + encodeURIComponent(currentUrl);
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
      
      // Mettre à jour les URLs de partage avec l'URL actuelle de l'événement
      this.updateShareUrls();
      
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
    console.log('handleCTAClick called', {
      isAuthenticated: this.isAuthenticated,
      isRegularUser: this.isRegularUser,
      isFeatured: this.event?.featured,
      currentUser: this.currentUser
    });

    if (!this.isAuthenticated) {
      // Pour les événements featured, afficher le modal inline
      if (this.event.featured) {
        console.log('Showing auth modal for featured event');
        this.showAuthModal = true;
        this.currentStep = 'auth';
      } else {
        // Pour les événements normaux, rediriger vers login
        console.log('Redirecting to login');
        this.router.navigate(['/authentication/login']);
      }
      return;
    }

    // Si l'utilisateur est connecté et c'est un événement featured
    if (this.event.featured && this.isRegularUser) {
      // Démarrer le workflow de matching directement
      console.log('Starting featured event flow');
      this.startFeaturedEventFlow();
      return;
    }

    if (this.isCompany) {
      console.log('Opening participation modal for company');
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

  // Featured event matching methods
  startFeaturedEventFlow(): void {
    // Réinitialiser l'état
    this.hasAttemptedMatching = false;
    this.matchingError = null;
    
    // Vérifier si l'utilisateur est authentifié
    if (!this.currentUser) {
      console.error('User not authenticated');
      this.showAuthModal = true;
      this.currentStep = 'auth';
      return;
    }
    
    // Vérifier si l'utilisateur a déjà un profil
    this.matchingProfileService.getMyMatchingProfiles().subscribe({
      next: (profiles) => {
        if (profiles && profiles.length > 0) {
          this.currentProfile = profiles[0];
          this.currentStep = 'matching';
          this.startMatching();
        } else {
          // Pas de profil, afficher le formulaire
          this.currentStep = 'profile';
        }
      },
      error: (err) => {
        console.error('Error loading profiles:', err);
        // En cas d'erreur, afficher le formulaire de profil
        this.currentStep = 'profile';
      }
    });
  }

  loadExistingProfilesAndStartMatching(): void {
    this.startFeaturedEventFlow();
  }

  handleProfileSaved(profile: any): void {
    this.currentProfile = profile;
    this.hasAttemptedMatching = false; // Réinitialiser pour permettre le matching
    this.currentStep = 'matching';
    this.startMatching();
  }

  startMatching(): void {
    if (!this.currentProfile || !this.currentProfile.id || this.hasAttemptedMatching) {
      return;
    }

    this.loadingMatching = true;
    this.matchingError = null;
    this.hasAttemptedMatching = true;

    // Lancer le matching avec l'eventId pour ne matcher qu'avec les entreprises de l'événement
    this.matchingProfileService.matchProfileWithCompanies(this.currentProfile.id, this.event?.id).subscribe({
      next: (result) => {
        // Attendre un peu pour l'effet visuel
        setTimeout(() => {
          this.loadMatchedCompanies();
        }, 2000);
      },
      error: (error) => {
        console.error('Error matching profile:', error);
        this.matchingError = error.message || 'Une erreur est survenue lors du matching';
        this.loadingMatching = false;
        this.hasAttemptedMatching = false;
      }
    });
  }

  loadMatchedCompanies(): void {
    console.log('loadMatchedCompanies called');
    console.log('Event:', this.event);
    console.log('Event companies:', this.event?.companies);
    
    if (!this.event || !this.event.companies) {
      this.matchingError = 'Aucune entreprise ne participe à cet événement';
      this.loadingMatching = false;
      console.error('No event or companies');
      return;
    }

    const eventCompanyIds = this.event.companies.map((c: any) => c.id);
    console.log('Event company IDs:', eventCompanyIds);
    console.log('Current profile ID:', this.currentProfile.id);
    
    this.featuredEventMatchingService.matchWithEventCompanies(
      this.currentProfile.id,
      eventCompanyIds
    ).subscribe({
      next: (matches) => {
        console.log('Matched companies received:', matches);
        console.log('Number of matches:', matches.length);
        this.matchedCompanies = matches;
        
        // Également matcher avec les jobs
        this.loadMatchedJobs(eventCompanyIds);
        
        this.loadingMatching = false;
        this.currentStep = 'results';
        console.log('Current step set to results');
      },
      error: (error) => {
        console.error('Error loading matched companies:', error);
        this.matchingError = error.message || 'Une erreur est survenue';
        this.loadingMatching = false;
      }
    });
  }

  loadMatchedJobs(eventCompanyIds: string[]): void {
    this.featuredEventMatchingService.matchProfileWithEventJobs(
      this.currentProfile,
      eventCompanyIds
    ).subscribe({
      next: (jobs) => {
        this.matchedJobs = jobs;
      },
      error: (error) => {
        console.error('Error loading matched jobs:', error);
      }
    });
  }

  retryMatching(): void {
    this.hasAttemptedMatching = false;
    this.matchingError = null;
    this.startMatching();
  }

  goToStep(step: 'auth' | 'profile' | 'matching' | 'results' | 'appointments'): void {
    this.currentStep = step;
  }

  getEventDateString(): string | null {
    if (!this.event || !this.event.date) {
      return null;
    }
    // Convertir la date en format ISO string (YYYY-MM-DD)
    const date = new Date(this.event.date);
    return date.toISOString().split('T')[0];
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
    this.currentStep = 'auth';
  }

  onAuthenticated(): void {
    // Fermer le modal d'authentification
    this.showAuthModal = false;
    // Démarrer le processus de matching
    this.startFeaturedEventFlow();
  }

  closeProfileForm(): void {
    this.currentStep = 'auth';
  }

  closeCompanyMatches(): void {
    this.currentStep = 'auth';
    this.selectedCompanies = [];
  }

  isCompanySelectedForAppointment(match: any): boolean {
    return this.selectedCompanies.some(c => c.company.id === match.company.id);
  }

  toggleCompanySelectionForAppointment(match: any): void {
    const index = this.selectedCompanies.findIndex(c => c.company.id === match.company.id);
    if (index > -1) {
      this.selectedCompanies.splice(index, 1);
    } else {
      this.selectedCompanies.push(match); // Store the full match object
    }
  }

  getSelectedCompaniesCount(): number {
    return this.selectedCompanies.length;
  }

  goToAppointments(): void {
    if (this.selectedCompanies.length === 0) {
      alert('Veuillez sélectionner au moins une entreprise');
      return;
    }
    this.currentStep = 'appointments';
  }

  closeAppointments(): void {
    this.currentStep = 'results';
  }
}
