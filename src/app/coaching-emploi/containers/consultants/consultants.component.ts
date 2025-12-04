import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConsultantService, Consultant as ApiConsultant, ConsultantPricing } from '../../services/consultant.service';

interface Consultant {
  id: string;
  initial: string;
  name: string;
  title: string;
  languages: { flag: string; name: string }[];
  experience: string;
  specialties: string[];
  pricings: ConsultantPricing[];
}

@Component({
  selector: 'app-consultants',
  templateUrl: './consultants.component.html',
  styleUrls: ['./consultants.component.scss'],
})
export class ConsultantsComponent implements OnInit {
  consultants: Consultant[] = [];
  loading = true;

  constructor(private consultantService: ConsultantService) {}

  ngOnInit(): void {
    this.loadConsultants();
  }

  loadConsultants(): void {
    this.consultantService.getConsultants().subscribe({
      next: (apiConsultants) => {
        console.log('Consultants loaded:', apiConsultants);

        if (!apiConsultants || apiConsultants.length === 0) {
          console.log('No consultants from API, using only fallback data');
          this.consultants = this.getFallbackConsultants();
          this.loading = false;
          return;
        }

        const pricingRequests = apiConsultants.map((consultant) =>
          this.consultantService.getPricings(consultant.id)
        );

        forkJoin(pricingRequests).subscribe({
          next: (pricingsArray) => {
            console.log('Pricings loaded:', pricingsArray);
            const apiConsultantsList = apiConsultants.map((consultant, index) => ({
              id: consultant.id,
              initial: consultant.user.firstname?.charAt(0).toUpperCase() || 'C',
              name: `${consultant.user.firstname} ${consultant.user.lastname}`,
              title: consultant.title || 'Consultant RH',
              languages: [
                { flag: '🇫🇷', name: 'Français' },
                { flag: '🇬🇧', name: 'English' },
              ],
              experience: consultant.yearsOfExperience
                ? `${consultant.yearsOfExperience}+ ans d'expérience`
                : 'Expérience confirmée',
              specialties: consultant.expertise
                ? consultant.expertise.split(',').map((s) => s.trim())
                : [],
              pricings: pricingsArray[index] || [],
            }));

            // Combine API consultants with fallback consultants
            this.consultants = [...this.getFallbackConsultants(), ...apiConsultantsList];
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading pricings:', error);
            const apiConsultantsList = apiConsultants.map((consultant) => ({
              id: consultant.id,
              initial: consultant.user.firstname?.charAt(0).toUpperCase() || 'C',
              name: `${consultant.user.firstname} ${consultant.user.lastname}`,
              title: consultant.title || 'Consultant RH',
              languages: [
                { flag: '🇫🇷', name: 'Français' },
                { flag: '🇬🇧', name: 'English' },
              ],
              experience: consultant.yearsOfExperience
                ? `${consultant.yearsOfExperience}+ ans d'expérience`
                : 'Expérience confirmée',
              specialties: consultant.expertise
                ? consultant.expertise.split(',').map((s) => s.trim())
                : [],
              pricings: [],
            }));

            // Combine API consultants with fallback consultants even on error
            this.consultants = [...this.getFallbackConsultants(), ...apiConsultantsList];
            this.loading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error loading consultants:', error);
        this.consultants = this.getFallbackConsultants();
        this.loading = false;
      },
    });
  }

  private getFallbackConsultants(): Consultant[] {
    return [
      {
        id: 'guy',
        initial: 'G',
        name: 'Guy',
        title: 'Consultant RH Senior',
        languages: [
          { flag: '🇫🇷', name: 'Français' },
          { flag: '🇬🇧', name: 'English' },
        ],
        experience: "15+ ans d'expérience",
        specialties: ['Transitions de carrière', 'Leadership', 'Stratégie de recherche'],
        pricings: [],
      },
      {
        id: 'kerian',
        initial: 'K',
        name: 'Kerian',
        title: 'Consultant RH',
        languages: [
          { flag: '🇫🇷', name: 'Français' },
          { flag: '🇬🇧', name: 'English' },
        ],
        experience: "10+ ans d'expérience",
        specialties: ['Développement professionnel', 'CV & Entretiens', 'Networking'],
        pricings: [],
      },
    ];
  }
}
