import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.interface';
import { getLoggedUser, getUserLoggedIn } from 'src/app/authentication/store/selectors/authentication.selectors';
import { MatchingProfileService } from '../../services/matching-profile.service';

@Component({
  selector: 'app-matching-profile-root',
  templateUrl: './matching-profile-root.component.html',
  styleUrls: ['./matching-profile-root.component.scss']
})
export class MatchingProfileRootComponent implements OnInit {
  currentUser$: Observable<User>;
  isLoggedIn$: Observable<boolean>;
  currentUser: User | null = null;
  currentStep = 1;
  currentProfile: any = null;
  loading = false;
  error: string | null = null;
  showAuthModal = false;
  authModalView: 'login' | 'register' = 'login';

  constructor(
    private store: Store,
    private matchingProfileService: MatchingProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.pipe(select(getLoggedUser));
    this.isLoggedIn$ = this.store.pipe(select(getUserLoggedIn));

    // Check authentication status
    this.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.showAuthModal = true;
      } else {
        this.loadExistingProfiles();
      }
    });

    // Listen for authentication changes - modal will close automatically
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn && this.showAuthModal) {
        this.showAuthModal = false;
        this.loadExistingProfiles();
      }
    });

    // Get current user
    this.currentUser$.pipe(
      filter(user => !!user)
    ).subscribe(user => {
      this.currentUser = user;
    });
  }

  loadExistingProfiles(): void {
    // Don't load existing profiles if we're starting a new matching
    if (this.currentStep === 1 && !this.currentProfile) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.matchingProfileService.getMyMatchingProfiles().subscribe({
      next: (profiles) => {
        // Only load if we don't have a current profile (initial load)
        if (!this.currentProfile && profiles && profiles.length > 0) {
          // Charger le dernier profil créé
          this.currentProfile = profiles[0];
          // Si le profil est actif, aller à l'étape 2
          if (this.currentProfile.status === 'ACTIVE' || this.currentProfile.status === 'COMPLETED') {
            this.currentStep = 2;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profiles:', err);
        this.loading = false;
      }
    });
  }

  handleSaveProfile(profile: any): void {
    this.currentProfile = profile;
    // Automatically go to step 2 after saving
    if (profile && profile.id) {
      this.goToStep(2);
    }
  }

  goToStep(step: number): void {
    // Prevent going to step 2 without a valid profile
    if (step === 2 && (!this.currentProfile || !this.currentProfile.id)) {
      this.error = 'Veuillez d\'abord créer votre profil';
      return;
    }
    
    // Prevent going to step 3 without matches
    if (step === 3 && (!this.currentProfile || !this.currentProfile.id)) {
      this.error = 'Veuillez d\'abord compléter les étapes précédentes';
      return;
    }
    
    this.currentStep = step;
    this.error = null;
  }

  startNewMatching(): void {
    // Reset everything for a new matching
    this.currentProfile = null;
    this.currentStep = 1;
    this.error = null;
    // Don't reload existing profiles - we want a clean slate
  }

  switchAuthView(view: 'login' | 'register'): void {
    this.authModalView = view;
  }
}
