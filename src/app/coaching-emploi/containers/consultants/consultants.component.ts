import { Component } from '@angular/core';

interface Consultant {
  id: string;
  initial: string;
  name: string;
  title: string;
  languages: { flag: string; name: string }[];
  experience: string;
  specialties: string[];
}

@Component({
  selector: 'app-consultants',
  templateUrl: './consultants.component.html',
  styleUrls: ['./consultants.component.scss'],
})
export class ConsultantsComponent {
  consultants: Consultant[] = [
    {
      id: 'guy',
      initial: 'G',
      name: 'Guy',
      title: 'Consultant RH Senior',
      languages: [
        { flag: '🇫🇷', name: 'Français' },
        { flag: '🇬🇧', name: 'English' },
      ],
      experience: '15+ ans d\'expérience',
      specialties: [
        'Transitions de carrière',
        'Leadership',
        'Stratégie de recherche',
      ],
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
      experience: '10+ ans d\'expérience',
      specialties: [
        'Développement professionnel',
        'CV & Entretiens',
        'Networking',
      ],
    },
  ];
}
