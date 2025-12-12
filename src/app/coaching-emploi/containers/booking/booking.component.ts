import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { TIMEZONES, Timezone } from '../../constants/timezones';
import { ConsultantService, Consultant } from '../../services/consultant.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  consultantName: string;
  consultantData: Consultant | null = null;
  serviceType: 'bilan' | 'accompagnement';
  serviceName: string;
  contactData: any;
  serviceData: any; // Données du service sélectionné
  
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
    private stripeService: StripeService,
    private consultantService: ConsultantService
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
      } else {
        // Essayer de trouver un fuseau similaire dans la même région
        const similarTimezone = this.findSimilarTimezone(browserTimezone);
        this.selectedTimezone = similarTimezone || 'Europe/Paris';
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
    
    // Créneaux par défaut (peuvent être personnalisés par consultant plus tard)
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour) {
        this.timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    this.timeSlots.push('17:30');
  }
  
  onTimezoneChange() {
    // Réinitialiser l'heure sélectionnée si le fuseau change
    this.selectedTime = '';
  }



  // Charger les données du consultant
  loadConsultantData(consultantId: string) {
    this.consultantService.getConsultantById(consultantId).subscribe({
      next: (consultant) => {
        this.consultantData = consultant;
        if (consultant?.user) {
          this.consultantName = `${consultant.user.firstname} ${consultant.user.lastname}`;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du consultant:', error);
      }
    });
  }

  // Valider la structure des données du service
  private validateServiceData(data: any): boolean {
    const requiredFields = ['pricingId', 'title', 'price'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return false;
    }
    
    if (!data.consultant || !data.consultant.id) {
      return false;
    }
    
    return true;
  }

  ngOnInit(): void {
    // Récupérer les paramètres de route
    this.route.paramMap.subscribe(params => {
      const consultantParam = params.get('consultant');
      const serviceParam = params.get('service');
      
      // Récupérer les données du service sélectionné
      const storedServiceData = sessionStorage.getItem('selectedServiceData');
      
      if (storedServiceData) {
        try {
          // Service dynamique sélectionné
          this.serviceData = JSON.parse(storedServiceData);
          
          // Vérifier que les données correspondent au consultant actuel
          const storedConsultantId = this.serviceData.consultant?.id;
          if (consultantParam && storedConsultantId && consultantParam !== storedConsultantId) {
            sessionStorage.removeItem('selectedServiceData');
            this.serviceData = null;
          } else if (this.validateServiceData(this.serviceData)) {
            this.consultantName = this.serviceData.consultant?.name || consultantParam || 'Consultant';
            this.serviceName = this.serviceData.title;
            
            // Charger les données complètes du consultant
            if (this.serviceData.consultant?.id) {
              this.loadConsultantData(this.serviceData.consultant.id);
            }
          } else {
            sessionStorage.removeItem('selectedServiceData');
            this.serviceData = null;
          }
        } catch (error) {
          console.error('Erreur lors du parsing des données:', error);
          this.serviceData = null;
        }
      }
      
      // Si pas de données de service ou données nettoyées
      if (!this.serviceData) {
        if (consultantParam && serviceParam) {
          // Service statique (guy, kerian)
          this.consultantName = consultantParam;
          this.serviceType = serviceParam as 'bilan' | 'accompagnement';
          this.serviceName = this.serviceType === 'bilan' 
            ? 'Bilan Emploi (2h)' 
            : 'Accompagnement Emploi (2 mois)';
        } else if (consultantParam) {
          // Page booking d'un consultant sans service spécifique
          this.consultantName = consultantParam;
          this.serviceName = 'Service de coaching';
          
          // Charger les données du consultant
          this.loadConsultantData(consultantParam);
        }
      }
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

  get sortedTimezones(): Timezone[] {
    // Trier les fuseaux horaires par région puis par nom
    return [...this.timezones].sort((a, b) => {
      const regionA = a.value.split('/')[0];
      const regionB = b.value.split('/')[0];
      
      if (regionA !== regionB) {
        // Ordre des régions
        const regionOrder = ['Europe', 'America', 'Asia', 'Africa', 'Australia', 'Pacific', 'Atlantic'];
        const indexA = regionOrder.indexOf(regionA);
        const indexB = regionOrder.indexOf(regionB);
        
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        return regionA.localeCompare(regionB);
      }
      
      return a.label.localeCompare(b.label);
    });
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

    // Calculer le montant en centimes
    let amount: number;
    let serviceTitle: string;
    let pricingId: string | undefined;
    let serviceDetails: any = undefined;

    if (this.serviceData) {
      // Service dynamique avec pricing
      amount = this.serviceData.price * 100;
      serviceTitle = this.serviceData.title;
      pricingId = this.serviceData.pricingId;
      serviceDetails = {
        id: this.serviceData.pricingId,
        title: this.serviceData.title,
        description: this.serviceData.description,
        price: this.serviceData.price,
        unit: this.serviceData.unit,
        duration: this.serviceData.duration,
        features: this.serviceData.features
      };
    } else {
      // Services statiques (Guy et Kerian) - utiliser les vrais prix
      if (this.serviceType === 'bilan') {
        amount = 25000; // 250€
        serviceTitle = 'Bilan Emploi';
      } else {
        amount = 30000; // 300€
        serviceTitle = 'Accompagnement Emploi';
      }
    }

    // Récupérer l'ID du consultant
    const consultantId = this.serviceData?.consultant?.id || this.route.snapshot.paramMap.get('consultant') || this.consultantName;
    
    const checkoutData = {
      contact: this.contactData,
      consultant: consultantId,
      service: serviceTitle,
      date: this.selectedDate.toISOString().split('T')[0],
      time: this.selectedTime,
      frequency: this.serviceType === 'accompagnement' ? this.frequency : undefined,
      timezone: this.selectedTimezone,
      amount: amount,
      pricingId: pricingId,
      serviceDetails: serviceDetails,
    };

    // Stocker les données pour référence
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
