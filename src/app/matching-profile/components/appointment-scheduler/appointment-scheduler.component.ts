import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchingProfileService } from '../../services/matching-profile.service';

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: any[];
  isSelected: boolean;
}

@Component({
  selector: 'app-appointment-scheduler',
  templateUrl: './appointment-scheduler.component.html',
  styleUrls: ['./appointment-scheduler.component.scss']
})
export class AppointmentSchedulerComponent implements OnInit {
  @Input() profileId: string;
  @Input() eventCompanyIds: string[] = []; // Pour filtrer par événement
  @Input() eventDate: string | null = null; // Date de l'événement à utiliser par défaut
  @Input() preSelectedMatches: any[] = []; // Matches déjà sélectionnés (pour les événements featured)
  
  // Nouvelles propriétés pour les événements mis en avant
  @Input() eventStartDate: string | null = null; // Date de début de l'événement
  @Input() eventEndDate: string | null = null; // Date de fin de l'événement
  @Input() eventStartTime: string | null = null; // Heure de début (ex: "09:00")
  @Input() eventEndTime: string | null = null; // Heure de fin (ex: "18:00")
  @Input() isFeaturedEvent: boolean = false; // Indique si c'est un événement featured
  
  @Output() back = new EventEmitter<void>();

  appointments: any[] = [];
  selectedCompanies: any[] = [];
  loading = false;
  showForm = false;
  selectedCompany: any = null;
  form: FormGroup;
  submitting = false;
  minDate: string;

  // Calendar properties
  currentDate = new Date();
  selectedDate: string | null = null;
  monthWeeks: CalendarDay[][] = [];
  availableTimeSlots: string[] = [];

  constructor(
    private fb: FormBuilder,
    private matchingProfileService: MatchingProfileService
  ) {
    this.form = this.fb.group({
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      message: ['']
    });
    
    // Set minimum date to today
    this.minDate = new Date().toISOString().split('T')[0];
    
    // Generate time slots (9h to 18h)
    this.generateTimeSlots();
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadSelectedCompanies();
    this.generateCalendar();
    
    // Pour les événements featured, adapter les dates min/max et les créneaux horaires
    if (this.isFeaturedEvent) {
      this.setupFeaturedEventConstraints();
    }
  }

  generateTimeSlots(): void {
    const slots = [];
    
    if (this.isFeaturedEvent && this.eventStartTime && this.eventEndTime) {
      // Pour les événements featured, utiliser les heures de l'événement
      const [startHour, startMinute] = this.eventStartTime.split(':').map(Number);
      const [endHour, endMinute] = this.eventEndTime.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
        const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        slots.push(timeSlot);
        
        // Incrémenter de 15 minutes
        currentMinute += 15;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour++;
        }
        
        // Éviter une boucle infinie
        if (currentHour > 23) break;
      }
    } else {
      // Comportement par défaut : créneaux de 15 minutes de 9h à 18h
      for (let hour = 9; hour <= 17; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:15`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
        slots.push(`${hour.toString().padStart(2, '0')}:45`);
      }
      // Ajouter les derniers créneaux de 18h
      slots.push('18:00');
    }
    
    this.availableTimeSlots = slots;
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = this.getStartOfWeek(firstDay);
    const weeks: CalendarDay[][] = [];
    
    let currentWeekStart = new Date(startDate);
    
    while (currentWeekStart <= lastDay || currentWeekStart.getMonth() === month) {
      const week: CalendarDay[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        
        // Utiliser un formatage manuel pour éviter les problèmes de timezone
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayAppointments = this.appointments.filter(a => a.appointmentDate === dateStr);
        
        // Utiliser le même formatage pour today
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        week.push({
          date: dateStr,
          day: date.getDate(),
          isCurrentMonth: date.getMonth() === month,
          isToday: dateStr === todayStr,
          appointments: dayAppointments,
          isSelected: dateStr === this.selectedDate
        });
      }
      weeks.push(week);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      
      if (weeks.length > 6) break;
    }
    
    this.monthWeeks = weeks;
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  get currentPeriodLabel(): string {
    return this.currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDate = new Date(this.currentDate);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = new Date(this.currentDate);
    this.generateCalendar();
  }

  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    
    // Pour les événements featured, vérifier que la date est dans la période de l'événement
    if (this.isFeaturedEvent) {
      if (!this.isDateInEventPeriod(day.date)) {
        return; // Ne pas permettre la sélection de dates hors période d'événement
      }
    } else {
      // Comportement par défaut : ne pas permettre les dates passées
      const today = new Date().toISOString().split('T')[0];
      if (day.date < today) return;
    }
    
    this.selectedDate = day.date;
    this.form.patchValue({ appointmentDate: day.date });
    this.generateCalendar();
  }

  selectTimeSlot(time: string): void {
    // Ne permettre la sélection que si le créneau est disponible
    if (this.isTimeSlotAvailable(time)) {
      this.form.patchValue({ appointmentTime: time });
    }
  }

  isTimeSlotAvailable(time: string): boolean {
    if (!this.selectedDate) {
      return true;
    }

    // Vérifier si ce créneau est déjà réservé
    return !this.appointments.some(
      apt => apt.appointmentDate === this.selectedDate && 
             apt.appointmentTime === time && 
             apt.status !== 'CANCELLED'
    );
  }

  loadAppointments(): void {
    if (!this.profileId) return;

    this.loading = true;
    this.matchingProfileService.getProfileAppointments(this.profileId).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.generateCalendar();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.loading = false;
      }
    });
  }

  loadSelectedCompanies(): void {
    // Si des matches sont déjà fournis (cas des événements featured), les utiliser directement
    if (this.preSelectedMatches && this.preSelectedMatches.length > 0) {
      this.selectedCompanies = this.preSelectedMatches;
      return;
    }

    // Sinon, charger depuis le backend (comportement normal du matching profile)
    if (!this.profileId) return;

    this.matchingProfileService.getMatchedCompanies(this.profileId).subscribe({
      next: (matches) => {
        // Filtrer par eventCompanyIds si fourni, puis par isSelected
        let filteredMatches = matches;
        if (this.eventCompanyIds && this.eventCompanyIds.length > 0) {
          filteredMatches = matches.filter((m: any) => this.eventCompanyIds.includes(m.company.id));
        }
        this.selectedCompanies = filteredMatches.filter(m => m.isSelected);
      },
      error: (err) => {
        console.error('Error loading companies:', err);
      }
    });
  }

  openAppointmentForm(company: any): void {
    // Vérifier si l'utilisateur a déjà un rendez-vous avec cette entreprise
    const existingAppointment = this.appointments.find(
      apt => apt.company.id === company.companyId && apt.status !== 'CANCELLED'
    );
    
    if (existingAppointment) {
      alert('Vous avez déjà un rendez-vous avec cette entreprise.');
      return;
    }

    this.selectedCompany = company;
    this.showForm = true;
    
    // Si une date d'événement est fournie, l'utiliser par défaut
    if (this.eventDate) {
      this.selectedDate = this.eventDate;
      this.form.patchValue({ appointmentDate: this.eventDate });
      
      // Naviguer vers le mois de l'événement
      const eventDateObj = new Date(this.eventDate);
      this.currentDate = new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), 1);
    } else {
      this.selectedDate = null;
      this.form.reset();
    }
    
    // Régénérer le calendrier pour s'assurer qu'il est à jour
    this.generateCalendar();
    
    console.log('Opening form, monthWeeks:', this.monthWeeks);
    console.log('Available time slots:', this.availableTimeSlots);
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedCompany = null;
    this.selectedDate = null;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedCompany) return;

    this.submitting = true;

    const input = {
      matchingProfileId: this.profileId,
      companyId: this.selectedCompany.companyId,
      appointmentDate: this.form.value.appointmentDate,
      appointmentTime: this.form.value.appointmentTime,
      timezone: 'Europe/Paris',
      message: this.form.value.message || ''
    };

    this.matchingProfileService.createCompanyAppointment(input).subscribe({
      next: (appointment) => {
        this.submitting = false;
        this.closeForm();
        this.loadAppointments();
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error creating appointment:', err);
        
        // Afficher un message d'erreur approprié
        const errorMessage = err.error?.errors?.[0]?.message || err.message || 'Erreur lors de la création du rendez-vous';
        
        if (errorMessage.includes('déjà un rendez-vous')) {
          alert('Vous avez déjà un rendez-vous avec cette entreprise.');
        } else if (errorMessage.includes('créneau') || errorMessage.includes('réservé')) {
          alert('Ce créneau horaire est déjà réservé. Veuillez en choisir un autre.');
          // Recharger les rendez-vous pour mettre à jour les créneaux disponibles
          this.loadAppointments();
        } else {
          alert(errorMessage);
        }
      }
    });
  }

  cancelAppointment(appointmentId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

    this.matchingProfileService.cancelAppointment(appointmentId).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error cancelling appointment:', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-warning';
      case 'CONFIRMED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      case 'COMPLETED': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'CONFIRMED': return 'Confirmé';
      case 'CANCELLED': return 'Annulé';
      case 'COMPLETED': return 'Terminé';
      default: return status;
    }
  }

  isAppointmentExpired(appointment: any): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    
    // Si la date est passée, le rendez-vous est expiré
    if (appointmentDate < today) {
      return true;
    }
    
    // Si c'est aujourd'hui, vérifier l'heure
    if (appointmentDate.getTime() === today.getTime()) {
      const [hours, minutes] = appointment.appointmentTime.split(':').map(Number);
      const appointmentDateTime = new Date();
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      return appointmentDateTime < new Date();
    }
    
    return false;
  }

  hasAppointmentWithCompany(companyId: string): boolean {
    return this.appointments.some(
      apt => apt.company.id === companyId && apt.status !== 'CANCELLED'
    );
  }

  getAppointmentStatusWithCompany(companyId: string): string | null {
    const appointment = this.appointments.find(
      apt => apt.company.id === companyId && apt.status !== 'CANCELLED'
    );
    return appointment ? appointment.status : null;
  }

  // Feedback Modal Management
  showFeedbackModal = false;
  selectedAppointmentForFeedback: any = null;

  openFeedbackModal(appointment: any): void {
    this.selectedAppointmentForFeedback = appointment;
    this.showFeedbackModal = true;
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
    this.selectedAppointmentForFeedback = null;
  }

  onFeedbackSubmitted(feedback: any): void {
    this.closeFeedbackModal();
    this.loadAppointments(); // Recharger pour afficher le feedback
  }

  // Méthodes pour gérer les contraintes des événements featured
  setupFeaturedEventConstraints(): void {
    if (this.eventStartDate) {
      // Définir la date minimum comme la date de début de l'événement ou aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      this.minDate = this.eventStartDate > today ? this.eventStartDate : today;
      
      // Naviguer vers le mois de l'événement en utilisant une approche plus simple
      const eventDate = new Date(this.eventStartDate + 'T12:00:00'); // Ajouter une heure pour éviter les problèmes de timezone
      this.currentDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), 1);
    }
    
    // Régénérer les créneaux horaires avec les contraintes de l'événement
    this.generateTimeSlots();
  }

  isDateInEventPeriod(date: string): boolean {
    if (!this.isFeaturedEvent || !this.eventStartDate) {
      return true; // Pas de contrainte si ce n'est pas un événement featured
    }
    
    // Utiliser une comparaison de chaînes pour éviter les problèmes de timezone
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const endDate = this.eventEndDate || this.eventStartDate;
    
    // La date doit être dans la période de l'événement et pas dans le passé
    return date >= this.eventStartDate && 
           date <= endDate && 
           date >= todayStr;
  }

  isDaySelectableInCalendar(day: CalendarDay): boolean {
    if (!day.isCurrentMonth) return false;
    
    if (this.isFeaturedEvent) {
      return this.isDateInEventPeriod(day.date);
    } else {
      const today = new Date().toISOString().split('T')[0];
      return day.date >= today;
    }
  }
}
