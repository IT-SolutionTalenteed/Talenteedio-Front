import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { MatchingProfileService } from '../../services/matching-profile.service';

@Component({
  selector: 'app-company-matches',
  templateUrl: './company-matches.component.html',
  styleUrls: ['./company-matches.component.scss']
})
export class CompanyMatchesComponent implements OnInit, OnChanges {
  @Input() profileId: string;
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  matches: any[] = [];
  loading = false;
  matching = false;
  error: string | null = null;
  hasAttemptedMatching = false; // Pour éviter la boucle infinie

  constructor(private matchingProfileService: MatchingProfileService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  ngOnChanges(changes: any): void {
    // Reset and reload when profileId changes (for new matching)
    if (changes.profileId) {
      // Reset everything
      this.hasAttemptedMatching = false;
      this.matches = [];
      this.error = null;
      this.matching = false;
      
      // Only load if we have a valid profileId
      if (this.profileId) {
        this.loadMatches();
      }
    }
  }

  loadMatches(): void {
    if (!this.profileId) {
      this.matches = [];
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.matchingProfileService.getMatchedCompanies(this.profileId).subscribe({
      next: (matches) => {
        this.matches = matches.sort((a, b) => b.matchScore - a.matchScore);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading matches:', err);
        this.loading = false;
        this.error = 'Erreur lors du chargement des entreprises matchées';
        this.matches = []; // Clear matches on error
      }
    });
  }

  startMatching(): void {
    if (this.matching || this.hasAttemptedMatching) return;
    
    this.matching = true;
    this.error = null;
    this.hasAttemptedMatching = true;

    this.matchingProfileService.matchProfileWithCompanies(this.profileId).subscribe({
      next: (result) => {
        this.matching = false;
        if (result.success) {
          this.loadMatches();
        } else {
          this.error = result.message || 'Erreur lors du matching';
        }
      },
      error: (err) => {
        this.matching = false;
        this.error = err.error?.errors?.[0]?.message || 'Erreur lors du matching. Veuillez vérifier que votre profil est complet.';
        console.error('Error matching:', err);
      }
    });
  }

  toggleSelection(match: any): void {
    this.matchingProfileService.toggleCompanySelection(match.id, !match.isSelected).subscribe({
      next: () => {
        match.isSelected = !match.isSelected;
      },
      error: (err) => {
        console.error('Error toggling selection:', err);
      }
    });
  }

  getSelectedCount(): number {
    return this.matches.filter(m => m.isSelected).length;
  }

  retryMatching(): void {
    this.hasAttemptedMatching = false;
    this.error = null;
    this.startMatching();
  }
}
