import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.interface';
import { getLoggedUser, getUserLoggedIn } from 'src/app/authentication/store/selectors/authentication.selectors';
import { EventService as SharedEventService } from 'src/app/shared/services/event.service';
import { MatchingProfileService } from 'src/app/matching-profile/services/matching-profile.service';
import { FeaturedEventMatchingService } from '../../services/featured-event-matching.service';

@Component({
  selector: 'app-featured-event-detail',
  templateUrl: './featured-event-detail.component.html',
  styleUrls: ['./featured-event-detail.component.scss']
})
export class FeaturedEventDetailComponent implements OnInit {
  currentUser$: Observable<User>;
  isLoggedIn$: Observable<boolean>;
  currentUser: User | null = null;
  
  // Event data
  featuredEvent: any = null;
  loadingEvent = true;
  
  // Workflow steps
  currentStep: 'event' | 'auth' | 'profile' | 'matching' | 'companies' | 'appointments' = 'event';
  
  // Matching data
  currentProfile: any = null;
  matchedCompanies: any[] = [];
  matchedJobs: any[] = [];
  selectedCompanies: any[] = [];
  eventAppointments: any[] = [];
  loadingMatching = false;
  matchingError: string | null = null;
  showJobsSection = false;
  
  // Appointment form
  showAppointmentForm = false;
  selectedCompanyForAppointment: any = null;
  appointmentForm: any = {
    date: '',
    time: '',
    message: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  // Auth modal
  showAuthModal = false;

  constructor(
    private store: Store,
    private sharedEventService: SharedEventService,
    private matchingProfileService: MatchingProfileService,
    private featuredEventMatchingService: FeaturedEventMatchingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.pipe(select(getLoggedUser));
    this.isLoggedIn$ = this.store.pipe(select(getUserLoggedIn));

    // Load featured event
    this.loadFeaturedEvent();

    // Get current user
    this.currentUser$.pipe(
      filter(user => !!user)
    ).subscribe(user => {
      this.currentUser = user;
      // If user just logged in and we're on auth step, move to profile
      if (this.currentStep === 'auth') {
        this.onAuthenticated();
      }
    });

    // Check initial authentication status
    this.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadExistingProfiles();
      }
    });
  }

  loadFeaturedEvent(): void {
    this.loadingEvent = true;
    this.sharedEventService.getFeaturedEvent().subscribe({
      next: (event) => {
        this.featuredEvent = event;
        this.loadingEvent = false;
      },
      error: (error) => {
        console.error('Error loading featured event:', error);
        this.loadingEvent = false;
      }
    });
  }

  loadExistingProfiles(): void {
    this.matchingProfileService.getMyMatchingProfiles().subscribe({
      next: (profiles) => {
        if (profiles && profiles.length > 0) {
          // Load the most recent profile
          this.currentProfile = profiles[0];
        }
      },
      error: (err) => {
        console.error('Error loading profiles:', err);
      }
    });
  }

  handleCTAClick(): void {
    if (!this.currentUser) {
      // Show auth modal inline instead of redirecting
      this.showAuthModal = true;
      this.currentStep = 'auth';
    } else {
      // User is logged in, go to profile step
      this.currentStep = 'profile';
    }
  }

  onAuthenticated(): void {
    // Called when user successfully logs in or registers
    this.showAuthModal = false;
    this.loadExistingProfiles();
    // After login, go to profile step
    this.currentStep = 'profile';
  }

  handleSaveProfile(profile: any): void {
    this.currentProfile = profile;
    // Automatically start matching after saving profile
    if (profile && profile.id) {
      this.startMatching();
    }
  }

  startMatching(): void {
    if (!this.currentProfile || !this.currentProfile.id) {
      this.matchingError = 'Veuillez d\'abord créer votre profil';
      return;
    }

    this.loadingMatching = true;
    this.matchingError = null;
    this.currentStep = 'matching';

    // First, trigger the matching process with the featured event ID
    this.matchingProfileService.matchProfileWithCompanies(this.currentProfile.id, this.featuredEvent?.id).subscribe({
      next: (result) => {
        console.log('Matching result:', result);
        // Then load the matched companies
        this.loadMatchedCompanies();
      },
      error: (error) => {
        console.error('Error matching profile:', error);
        this.matchingError = error.message || 'Une erreur est survenue lors du matching';
        this.loadingMatching = false;
      }
    });
  }

  loadMatchedCompanies(): void {
    if (!this.featuredEvent || !this.featuredEvent.companies) {
      this.matchingError = 'Aucune entreprise ne participe à cet événement';
      this.loadingMatching = false;
      return;
    }

    const eventCompanyIds = this.featuredEvent.companies.map((c: any) => c.id);
    
    this.featuredEventMatchingService.matchWithEventCompanies(
      this.currentProfile.id,
      eventCompanyIds
    ).subscribe({
      next: (matches) => {
        this.matchedCompanies = matches;
        
        // Également matcher avec les jobs des entreprises
        this.loadMatchedJobs(eventCompanyIds);
        
        this.loadingMatching = false;
        this.currentStep = 'companies';
        
        console.log(`Matched ${matches.length} companies from event`);
      },
      error: (error) => {
        console.error('Error loading matched companies:', error);
        this.matchingError = error.message || 'Une erreur est survenue lors du chargement des résultats';
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
        console.log(`Matched ${jobs.length} jobs from event companies`);
      },
      error: (error) => {
        console.error('Error loading matched jobs:', error);
        // Ne pas bloquer le workflow si les jobs ne se chargent pas
      }
    });
  }

  handleCompanySelection(company: any): void {
    const index = this.selectedCompanies.findIndex(c => c.id === company.id);
    if (index > -1) {
      this.selectedCompanies.splice(index, 1);
    } else {
      this.selectedCompanies.push(company);
    }
  }

  isCompanySelected(company: any): boolean {
    return this.selectedCompanies.some(c => c.id === company.id);
  }

  proceedToAppointments(): void {
    if (this.selectedCompanies.length === 0) {
      alert('Veuillez sélectionner au moins une entreprise');
      return;
    }
    this.currentStep = 'appointments';
    this.loadEventAppointments();
  }

  handleAppointmentCreated(): void {
    // Refresh appointments or show success message
    alert('Rendez-vous créé avec succès!');
    this.loadEventAppointments();
  }

  loadEventAppointments(): void {
    if (!this.currentProfile || !this.featuredEvent) return;
    
    const eventCompanyIds = this.featuredEvent.companies.map((c: any) => c.id);
    this.featuredEventMatchingService.getEventAppointments(
      this.currentProfile.id,
      eventCompanyIds
    ).subscribe({
      next: (appointments) => {
        this.eventAppointments = appointments;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  openAppointmentForm(company: any): void {
    this.selectedCompanyForAppointment = company;
    this.showAppointmentForm = true;
  }

  closeAppointmentForm(): void {
    this.showAppointmentForm = false;
    this.selectedCompanyForAppointment = null;
    this.appointmentForm = {
      date: '',
      time: '',
      message: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  submitAppointment(): void {
    if (!this.appointmentForm.date || !this.appointmentForm.time) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const appointmentInput = {
      companyId: this.selectedCompanyForAppointment.company.id,
      matchingProfileId: this.currentProfile.id,
      appointmentDate: this.appointmentForm.date,
      appointmentTime: this.appointmentForm.time,
      timezone: this.appointmentForm.timezone,
      message: this.appointmentForm.message
    };

    this.matchingProfileService.createCompanyAppointment(appointmentInput).subscribe({
      next: (appointment) => {
        alert('Rendez-vous créé avec succès!');
        this.closeAppointmentForm();
        this.loadEventAppointments();
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        alert(error.message || 'Une erreur est survenue');
      }
    });
  }

  backToEvent(): void {
    this.currentStep = 'event';
    this.currentProfile = null;
    this.matchedCompanies = [];
    this.selectedCompanies = [];
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  get ctaButtonText(): string {
    if (!this.isAuthenticated) {
      return 'Connectez-vous pour participer';
    }
    return 'Participer à l\'événement';
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
    this.currentStep = 'event';
  }
}
