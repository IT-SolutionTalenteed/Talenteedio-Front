import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { TIMEZONES, Timezone } from '../../constants/timezones';
import { ConsultantService, Consultant } from '../../services/consultant.service';
import { AvailabilityService, AvailabilityResponse } from '../../services/availability.service';
import { DateUtils } from '../../../shared/utils/date.utils';

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
  
  // Propriétés pour les événements
  eventStartDate: Date | null = null;
  eventEndDate: Date | null = null;
  eventStartTime: string | null = null;
  eventEndTime: string | null = null;
  
  timezones: Timezone[] = TIMEZONES;
  
  timeSlots: string[] = [];
  availableSlots: {[time: string]: boolean} = {};
  loadingAvailability: boolean = false;
  blockedDates: string[] = [];
  loadingBlockedDates: boolean = false;
  blockedDatesLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService,
    private consultantService: ConsultantService,
    private availabilityService: AvailabilityService
  ) {
    // Détecter automatiquement le fuseau horaire de l'utilisateur
    this.detectUserTimezone();
    this.generateTimeSlots();
    
    // Debug: exposer les méthodes dans la console pour les tests
    if (typeof window !== 'undefined') {
      (window as any).bookingDebug = {
        availableSlots: () => this.availableSlots,
        isTimeSlotAvailable: (time: string) => this.isTimeSlotAvailable(time),
        isTimeSlotDisabled: (time: string) => this.isTimeSlotDisabled(time),
        loadingAvailability: () => this.loadingAvailability,
        checkAvailability: (date: Date) => this.checkAvailabilityForDate(date),
        setMockMode: (enabled: boolean) => this.availabilityService.setMockMode(enabled),
        consultantId: () => this.getConsultantId(),
        reloadCurrentDate: () => {
          if (this.selectedDate) {
            this.checkAvailabilityForDate(this.selectedDate);
          }
        },
        inspectSlot: (time: string) => {
          console.log(`🔍 Inspection du créneau ${time}:`);
          console.log(`- Available: ${this.isTimeSlotAvailable(time)}`);
          console.log(`- Disabled: ${this.isTimeSlotDisabled(time)}`);
          console.log(`- Raw value: ${this.availableSlots[time]}`);
          console.log(`- Loading: ${this.loadingAvailability}`);
          
          // Vérifier les éléments DOM
          const buttons = document.querySelectorAll(`[data-time="${time}"]`);
          if (buttons.length > 0) {
            const button = buttons[0] as HTMLElement;
            console.log(`- DOM classes: ${button.className}`);
            console.log(`- DOM disabled: ${(button as HTMLButtonElement).disabled}`);
            console.log(`- DOM style: ${button.style.cssText}`);
          }
        },
        forceUnavailable: (time: string) => {
          this.availableSlots[time] = false;
          console.log(`Créneau ${time} forcé comme non disponible`);
        },
        forceAvailable: (time: string) => {
          this.availableSlots[time] = true;
          console.log(`Créneau ${time} forcé comme disponible`);
        },
        blockedDates: () => this.blockedDates,
        isDateBlocked: (date: string) => this.blockedDates.includes(date),
        blockDate: (date: string) => {
          if (!this.blockedDates.includes(date)) {
            this.blockedDates.push(date);
            console.log(`Date ${date} bloquée`);
          }
        },
        unblockDate: (date: string) => {
          const index = this.blockedDates.indexOf(date);
          if (index > -1) {
            this.blockedDates.splice(index, 1);
            console.log(`Date ${date} débloquée`);
          }
        },
        reloadBlockedDates: () => {
          this.blockedDatesLoaded = false;
          this.loadBlockedDates();
        },
        // Nouvelles méthodes pour les contraintes d'événement
        setEventConstraints: (startDate: string, endDate: string, startTime?: string, endTime?: string) => {
          // Créer les dates en utilisant les composants pour éviter les problèmes de timezone
          const startDateParts = startDate.split('-');
          const endDateParts = endDate.split('-');
          
          this.eventStartDate = new Date(
            parseInt(startDateParts[0]), 
            parseInt(startDateParts[1]) - 1, 
            parseInt(startDateParts[2])
          );
          this.eventEndDate = new Date(
            parseInt(endDateParts[0]), 
            parseInt(endDateParts[1]) - 1, 
            parseInt(endDateParts[2])
          );
          
          if (startTime) this.eventStartTime = startTime;
          if (endTime) this.eventEndTime = endTime;
          
          console.log('� Contraintes d\'événement définies:', {
            startDate: this.eventStartDate,
            endDate: this.eventEndDate,
            startTime: this.eventStartTime,
            endTime: this.eventEndTime
          });
          
          // Régénérer les créneaux et le calendrier
          this.generateTimeSlots();
          
          // Forcer la mise à jour du calendrier en déclenchant une détection de changement
          setTimeout(() => {
            console.log('🔄 Forçage de la régénération du calendrier...');
            // Déclencher manuellement la détection de changement Angular
            if ((window as any).ng && (window as any).ng.getComponent) {
              try {
                const element = document.querySelector('app-calendar');
                if (element) {
                  const component = (window as any).ng.getComponent(element);
                  if (component && component.generateCalendar) {
                    component.eventStartDate = this.eventStartDate;
                    component.eventEndDate = this.eventEndDate;
                    component.generateCalendar();
                    console.log('✅ Calendrier mis à jour avec les contraintes');
                  }
                }
              } catch (error) {
                console.log('⚠️ Impossible de mettre à jour le calendrier automatiquement');
                console.log('🔄 Veuillez recharger la page pour voir les contraintes appliquées');
              }
            }
          }, 100);
        },
        getEventConstraints: () => ({
          startDate: this.eventStartDate,
          endDate: this.eventEndDate,
          startTime: this.eventStartTime,
          endTime: this.eventEndTime
        }),
        clearEventConstraints: () => {
          this.eventStartDate = null;
          this.eventEndDate = null;
          this.eventStartTime = null;
          this.eventEndTime = null;
          this.generateTimeSlots();
          console.log('🗑️ Contraintes d\'événement supprimées');
        },
        help: () => {
          console.log(`
🔧 Booking Debug Commands:
- bookingDebug.availableSlots() - Voir l'état des créneaux
- bookingDebug.blockedDates() - Voir les dates bloquées
- bookingDebug.isTimeSlotAvailable('14:00') - Tester un créneau
- bookingDebug.isDateBlocked('2024-12-16') - Tester si une date est bloquée
- bookingDebug.blockDate('2024-12-16') - Bloquer une date
- bookingDebug.unblockDate('2024-12-16') - Débloquer une date
- bookingDebug.reloadBlockedDates() - Recharger les dates bloquées
- bookingDebug.inspectSlot('14:00') - Inspecter un créneau en détail
- bookingDebug.consultantId() - Voir l'ID du consultant
- bookingDebug.setMockMode(true/false) - Activer/désactiver le mock
- bookingDebug.reloadCurrentDate() - Recharger les créneaux de la date sélectionnée

📅 Event Constraints Commands:
- bookingDebug.setEventConstraints('2026-11-05', '2026-11-06', '09:00', '17:00') - Définir les contraintes
- bookingDebug.getEventConstraints() - Voir les contraintes actuelles
- bookingDebug.clearEventConstraints() - Supprimer les contraintes
- bookingDebug.help() - Afficher cette aide
          `);
        }
      };
    }
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
    
    // Si on a des heures d'événement définies, les utiliser
    let startHour = 9;
    let endHour = 17;
    
    if (this.eventStartTime && this.eventEndTime) {
      // Parser les heures de l'événement (format "HH:MM")
      const startParts = this.eventStartTime.split(':');
      const endParts = this.eventEndTime.split(':');
      
      startHour = parseInt(startParts[0], 10);
      endHour = parseInt(endParts[0], 10);
      
      // Si l'heure de fin a des minutes, on inclut cette heure
      if (parseInt(endParts[1], 10) > 0) {
        endHour += 1;
      }
    }
    
    // Générer les créneaux dans la plage horaire de l'événement
    for (let hour = startHour; hour < endHour; hour++) {
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:15`);
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:45`);
    }
    
    // Ajouter la dernière heure si elle correspond exactement à l'heure de fin
    if (this.eventEndTime) {
      const endParts = this.eventEndTime.split(':');
      const endMinutes = parseInt(endParts[1], 10);
      if (endMinutes === 0) {
        this.timeSlots.push(`${endHour.toString().padStart(2, '0')}:00`);
      }
    }
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
    // Charger les dates bloquées
    this.loadBlockedDates();
    
    // Récupérer les paramètres d'événement depuis les query params ou session storage
    this.loadEventParameters();
    
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

  private loadEventParameters(): void {
    // Récupérer les paramètres d'événement depuis les query params
    this.route.queryParams.subscribe(params => {
      console.log('📅 Query params reçus:', params);
      
      if (params['eventStartDate']) {
        // Créer la date en utilisant les composants pour éviter les problèmes de timezone
        const startDateParts = params['eventStartDate'].split('-');
        this.eventStartDate = new Date(
          parseInt(startDateParts[0]), 
          parseInt(startDateParts[1]) - 1, 
          parseInt(startDateParts[2])
        );
        console.log('📅 Event start date:', this.eventStartDate);
      }
      if (params['eventEndDate']) {
        // Créer la date en utilisant les composants pour éviter les problèmes de timezone
        const endDateParts = params['eventEndDate'].split('-');
        this.eventEndDate = new Date(
          parseInt(endDateParts[0]), 
          parseInt(endDateParts[1]) - 1, 
          parseInt(endDateParts[2])
        );
        console.log('📅 Event end date:', this.eventEndDate);
      }
      if (params['eventStartTime']) {
        this.eventStartTime = params['eventStartTime'];
        console.log('📅 Event start time:', this.eventStartTime);
      }
      if (params['eventEndTime']) {
        this.eventEndTime = params['eventEndTime'];
        console.log('📅 Event end time:', this.eventEndTime);
      }
      
      // Régénérer les créneaux horaires avec les nouvelles contraintes
      this.generateTimeSlots();
    });

    // Ou récupérer depuis sessionStorage si passé par un autre composant
    const eventData = sessionStorage.getItem('eventBookingData');
    if (eventData) {
      try {
        const data = JSON.parse(eventData);
        console.log('📅 Event data from sessionStorage:', data);
        
        if (data.startDate) {
          // Créer la date en utilisant les composants pour éviter les problèmes de timezone
          const startDateParts = data.startDate.split('-');
          this.eventStartDate = new Date(
            parseInt(startDateParts[0]), 
            parseInt(startDateParts[1]) - 1, 
            parseInt(startDateParts[2])
          );
          console.log('📅 Event start date from storage:', this.eventStartDate);
        }
        if (data.endDate) {
          // Créer la date en utilisant les composants pour éviter les problèmes de timezone
          const endDateParts = data.endDate.split('-');
          this.eventEndDate = new Date(
            parseInt(endDateParts[0]), 
            parseInt(endDateParts[1]) - 1, 
            parseInt(endDateParts[2])
          );
          console.log('📅 Event end date from storage:', this.eventEndDate);
        }
        if (data.startTime) {
          this.eventStartTime = data.startTime;
          console.log('📅 Event start time from storage:', this.eventStartTime);
        }
        if (data.endTime) {
          this.eventEndTime = data.endTime;
          console.log('📅 Event end time from storage:', this.eventEndTime);
        }
        
        // Pour les événements, utiliser les entreprises sélectionnées comme "consultants"
        if (data.selectedCompanies && data.selectedCompanies.length > 0) {
          this.serviceName = `Rendez-vous avec ${data.selectedCompanies.length} entreprise${data.selectedCompanies.length > 1 ? 's' : ''}`;
          this.consultantName = data.eventTitle || 'Événement';
        }
        
        // Régénérer les créneaux horaires
        this.generateTimeSlots();
      } catch (error) {
        console.error('Erreur lors du parsing des données d\'événement:', error);
      }
    }
    
    // Debug: afficher l'état final
    console.log('📅 État final des contraintes d\'événement:', {
      eventStartDate: this.eventStartDate,
      eventEndDate: this.eventEndDate,
      eventStartTime: this.eventStartTime,
      eventEndTime: this.eventEndTime
    });
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.selectedTime = ''; // Réinitialiser l'heure sélectionnée
    
    const dateStr = DateUtils.formatDateToString(date);
    
    // Vérifier si la date entière est bloquée
    if (this.blockedDates.includes(dateStr)) {
      console.log('📅 Date entière bloquée, pas de vérification des créneaux');
      // Marquer tous les créneaux comme non disponibles
      this.availableSlots = {};
      this.timeSlots.forEach(time => {
        this.availableSlots[time] = false;
      });
      return;
    }
    
    // Initialiser tous les créneaux comme non disponibles pendant le chargement
    this.availableSlots = {};
    this.timeSlots.forEach(time => {
      this.availableSlots[time] = false;
    });
    
    this.checkAvailabilityForDate(date);
  }

  private checkAvailabilityForDate(date: Date) {
    const consultantId = this.getConsultantId();
    if (!consultantId) {
      console.log('No consultant ID found');
      return;
    }

    const dateStr = DateUtils.formatDateToString(date);
    this.loadingAvailability = true;
    
    // Réinitialiser les créneaux disponibles
    this.availableSlots = {};
    
    console.log('🔍 Checking availability for:', { consultantId, dateStr, timeSlots: this.timeSlots });
    console.log('📡 Using real API (mock disabled)');

    // Vérifier chaque créneau individuellement
    const availabilityChecks = this.timeSlots.map(time => 
      this.availabilityService.checkAvailability(consultantId, dateStr, time)
        .toPromise()
        .then(result => {
          console.log(`Availability for ${time}:`, result);
          return { time, available: result.available, reason: result.reason };
        })
        .catch(error => {
          console.error(`Error checking ${time}:`, error);
          // En cas d'erreur, considérer comme non disponible pour la sécurité
          return { time, available: false, reason: 'Erreur de vérification' };
        })
    );

    Promise.all(availabilityChecks).then(results => {
      results.forEach(({ time, available, reason }) => {
        this.availableSlots[time] = available;
        if (!available && reason) {
          console.log(`Slot ${time} unavailable: ${reason}`);
        }
      });
      console.log('Final availability results:', this.availableSlots);
      this.loadingAvailability = false;
    }).catch(error => {
      console.error('Error checking availability:', error);
      this.loadingAvailability = false;
      // En cas d'erreur globale, marquer tous les créneaux comme non disponibles
      this.timeSlots.forEach(time => {
        this.availableSlots[time] = false;
      });
    });
  }

  private getConsultantId(): string | null {
    return this.serviceData?.consultant?.id || 
           this.route.snapshot.paramMap.get('consultant') || 
           this.consultantName;
  }

  private loadBlockedDates() {
    const consultantId = this.getConsultantId();
    if (!consultantId) {
      console.log('No consultant ID found for blocked dates');
      return;
    }

    this.loadingBlockedDates = true;
    console.log('📅 Loading blocked dates for consultant:', consultantId);

    this.availabilityService.getBlockedDates(consultantId).subscribe({
      next: (response) => {
        this.blockedDates = response.blockedDates;
        console.log('📅 Blocked dates loaded:', this.blockedDates);
        this.loadingBlockedDates = false;
        this.blockedDatesLoaded = true;
      },
      error: (error) => {
        console.error('Error loading blocked dates:', error);
        this.blockedDates = []; // En cas d'erreur, pas de dates bloquées
        this.loadingBlockedDates = false;
        this.blockedDatesLoaded = true;
      }
    });
  }

  isTimeSlotAvailable(time: string): boolean {
    // Si on est en train de charger, considérer comme non disponible
    if (this.loadingAvailability) {
      return false;
    }
    // Si pas encore vérifié, considérer comme non disponible
    if (this.availableSlots[time] === undefined) {
      return false;
    }
    
    // Vérifier si l'heure est dans la plage de l'événement
    if (!this.isTimeInEventRange(time)) {
      return false;
    }
    
    const available = this.availableSlots[time] === true;
    return available;
  }

  private isTimeInEventRange(time: string): boolean {
    // Si pas de contraintes d'événement, toutes les heures sont autorisées
    if (!this.eventStartTime && !this.eventEndTime) {
      return true;
    }
    
    const timeMinutes = this.timeToMinutes(time);
    
    if (this.eventStartTime) {
      const startMinutes = this.timeToMinutes(this.eventStartTime);
      if (timeMinutes < startMinutes) {
        return false;
      }
    }
    
    if (this.eventEndTime) {
      const endMinutes = this.timeToMinutes(this.eventEndTime);
      if (timeMinutes > endMinutes) {
        return false;
      }
    }
    
    return true;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Méthode pour forcer la mise à jour du calendrier avec les contraintes d'événement
  public updateCalendarConstraints(): void {
    // Cette méthode peut être appelée pour forcer la mise à jour du calendrier
    // Elle sera utile quand les contraintes sont définies dynamiquement
    console.log('🔄 Mise à jour des contraintes du calendrier...');
    console.log('📅 Contraintes actuelles:', {
      eventStartDate: this.eventStartDate,
      eventEndDate: this.eventEndDate,
      eventStartTime: this.eventStartTime,
      eventEndTime: this.eventEndTime
    });
  }

  isTimeSlotDisabled(time: string): boolean {
    const disabled = !this.isTimeSlotAvailable(time) || this.loadingAvailability;
    return disabled;
  }

  isDateBlocked(date: Date): boolean {
    const dateStr = DateUtils.formatDateToString(date);
    return this.blockedDates.includes(dateStr);
  }

  selectTime(time: string) {
    if (this.isTimeSlotDisabled(time)) {
      console.log(`Cannot select time ${time}: disabled or unavailable`);
      // Afficher un message visuel pour l'utilisateur
      const button = document.querySelector(`[data-time="${time}"]`) as HTMLElement;
      if (button) {
        button.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          button.style.animation = '';
        }, 500);
      }
      return; // Ne pas permettre la sélection d'un créneau non disponible
    }
    this.selectedTime = time;
    console.log(`Selected time: ${time}`);
  }
  
  showConfirmation() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Veuillez sélectionner une date et une heure');
      return;
    }
    
    // Vérifier que le créneau sélectionné est toujours disponible
    if (!this.isTimeSlotAvailable(this.selectedTime)) {
      alert('Le créneau sélectionné n\'est plus disponible. Veuillez en choisir un autre.');
      this.selectedTime = '';
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

    // Vérification finale de disponibilité
    if (!this.isTimeSlotAvailable(this.selectedTime)) {
      alert('Le créneau sélectionné n\'est plus disponible. Veuillez actualiser la page et choisir un autre créneau.');
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
      date: DateUtils.formatDateToString(this.selectedDate),
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
