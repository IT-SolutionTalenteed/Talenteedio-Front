import { Component, OnInit } from '@angular/core';

import { ConsultantService, ConsultantPricing } from '../../services/consultant.service';

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
        console.log('Consultants loaded from API:', apiConsultants);

        if (!apiConsultants || apiConsultants.length === 0) {
          console.log('No consultants from API');
          this.consultants = [];
          this.loading = false;
          return;
        }

        this.consultants = apiConsultants.map((consultant) => ({
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
          specialties:
            consultant.qualities && consultant.qualities.length > 0
              ? consultant.qualities
              : consultant.expertise
                ? consultant.expertise.split(',').map((s) => s.trim())
                : [],
          pricings: [],
        }));

        console.log('Final consultants list:', this.consultants);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading consultants:', error);
        this.consultants = [];
        this.loading = false;
      },
    });
  }
}
