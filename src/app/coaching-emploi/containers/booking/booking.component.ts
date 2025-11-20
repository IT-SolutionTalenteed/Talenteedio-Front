import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { TIMEZONES, Timezone } from '../../constants/timezones';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  consultantName: string;
  serviceType: 'bilan' | 'accompagnement';
  serviceName: string;
  contactData: any;
  
  selectedDate: Date | null = null;
  selectedTime: string = '';
  frequency: string = 'weekly';
  selectedTimezone: string;
  showConfirmationForm: boolean = false;
  
  timezones: Timezone[] = TIMEZONES;
  
  timeSlots: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService
  ) {
    // Détecter automatiquement le fuseau horaire de l'utilisateur
    this.detectUserTimezone();
    this.generateTimeSlots();
  }
  
  private detectUserTimezone() {
    try {
      // Obtenir le fuseau horaire du navigateur
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Vérifier si ce fuseau existe dans notre liste
      const foundTimezone = this.timezones.find(tz => tz.value === browserTimezone);
      
      if (foundTimezone) {
        this.selectedTimezone = browserTimezone;
        console.log(`✅ Fuseau horaire détecté: ${browserTimezone}`);
      } else {
        // Essayer de trouver un fuseau similaire
        const similarTimezone = this.findSimilarTimezone(browserTimezone);
        this.selectedTimezone = similarTimezone || 'Europe/Paris';
        console.log(`⚠️ Fuseau ${browserTimezone} non trouvé, utilisation de ${this.selectedTimezone}`);
      }
    } catch (error) {
      console.error('Erreur lors de la détection du fuseau horaire:', error);
      this.selectedTimezone = 'Europe/Paris';
    }
  }
  
  private findSimilarTimezone(timezone: string): string | null {
    // Extraire la région (ex: "Europe" de "Europe/Paris")
    const region = timezone.split('/')[0];
    
    // Chercher un fuseau dans la même région
    const regionalTimezone = this.timezones.find(tz => tz.value.startsWith(region + '/'));
    
    return regionalTimezone ? regionalTimezone.value : null;
  }
  
  generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        this.timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    this.timeSlots.push('17:30');
  }
  
  onTimezoneChange() {
    // Réinitialiser l'heure sélectionnée si le fuseau change
    this.selectedTime = '';
  }

  ngOnInit(): void {
    // Récupérer les paramètres de la route
    this.route.paramMap.subscribe(params => {
      this.consultantName = params.get('consultant') || '';
      this.serviceType = params.get('service') as 'bilan' | 'accompagnement';
      
      this.serviceName = this.serviceType === 'bilan' 
        ? 'Bilan Emploi (2h)' 
        : 'Accompagnement Emploi (2 mois)';
    });

    // Récupérer les données de contact
    const storedData = sessionStorage.getItem('coachingContactData');
    if (storedData) {
      this.contactData = JSON.parse(storedData);
    } else {
      // Initialiser avec des données vides
      this.contactData = {
        name: '',
        email: '',
        phone: ''
      };
    }
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.selectedTime = ''; // Réinitialiser l'heure sélectionnée
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }
  
  showConfirmation() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Veuillez sélectionner une date et une heure');
      return;
    }
    this.showConfirmationForm = true;
  }
  
  goBack() {
    this.showConfirmationForm = false;
  }

  get formattedSelectedDate(): string {
    if (!this.selectedDate) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: this.selectedTimezone
    };
    
    return this.selectedDate.toLocaleDateString('fr-FR', options);
  }
  
  get currentTimezoneLabel(): string {
    const tz = this.timezones.find(t => t.value === this.selectedTimezone);
    return tz ? `${tz.label} (${tz.offset})` : this.selectedTimezone;
  }
  
  get groupedTimezones() {
    const groups: { [key: string]: Timezone[] } = {
      'Europe': [],
      'Amérique du Nord': [],
      'Amérique du Sud': [],
      'Asie': [],
      'Afrique': [],
      'Océanie': [],
      'Autres': []
    };
    
    this.timezones.forEach(tz => {
      if (tz.value.startsWith('Europe/')) {
        groups['Europe'].push(tz);
      } else if (tz.value.startsWith('America/') && 
                 (tz.value.includes('New_York') || tz.value.includes('Chicago') || 
                  tz.value.includes('Los_Angeles') || tz.value.includes('Denver') ||
                  tz.value.includes('Toronto') || tz.value.includes('Vancouver') ||
                  tz.value.includes('Mexico') || tz.value.includes('Phoenix') ||
                  tz.value.includes('Anchorage'))) {
        groups['Amérique du Nord'].push(tz);
      } else if (tz.value.startsWith('America/')) {
        groups['Amérique du Sud'].push(tz);
      } else if (tz.value.startsWith('Asia/')) {
        groups['Asie'].push(tz);
      } else if (tz.value.startsWith('Africa/')) {
        groups['Afrique'].push(tz);
      } else if (tz.value.startsWith('Australia/') || tz.value.startsWith('Pacific/')) {
        groups['Océanie'].push(tz);
      } else {
        groups['Autres'].push(tz);
      }
    });
    
    return groups;
  }

  confirmBooking() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Veuillez sélectionner une date et une heure');
      return;
    }

    const checkoutData = {
      contact: this.contactData,
      consultant: this.consultantName,
      service: this.serviceType,
      date: this.selectedDate.toISOString().split('T')[0],
      time: this.selectedTime,
      frequency: this.serviceType === 'accompagnement' ? this.frequency : undefined,
      timezone: this.selectedTimezone, // Envoyer le fuseau horaire sélectionné
      amount: this.serviceType === 'bilan' ? 25000 : 30000,
    };

    sessionStorage.setItem('coachingBookingData', JSON.stringify(checkoutData));

    // Rediriger vers Stripe Checkout
    this.stripeService.createCoachingCheckoutSession(checkoutData).subscribe({
      next: (session) => {
        window.location.href = session.url;
      },
      error: (error) => {
        console.error('Erreur lors de la création de la session Stripe:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    });
  }
}
