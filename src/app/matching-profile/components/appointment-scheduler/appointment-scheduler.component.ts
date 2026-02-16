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
  }

  generateTimeSlots(): void {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    slots.push('17:30');
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
        
        const dateStr = date.toISOString().split('T')[0];
        const dayAppointments = this.appointments.filter(a => a.appointmentDate === dateStr);
        const today = new Date().toISOString().split('T')[0];
        
        week.push({
          date: dateStr,
          day: date.getDate(),
          isCurrentMonth: date.getMonth() === month,
          isToday: dateStr === today,
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
    
    const today = new Date().toISOString().split('T')[0];
    if (day.date < today) return; // Can't select past dates
    
    this.selectedDate = day.date;
    this.form.patchValue({ appointmentDate: day.date });
    this.generateCalendar();
  }

  selectTimeSlot(time: string): void {
    this.form.patchValue({ appointmentTime: time });
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
    if (!this.profileId) return;

    this.matchingProfileService.getMatchedCompanies(this.profileId).subscribe({
      next: (matches) => {
        this.selectedCompanies = matches.filter(m => m.isSelected);
      },
      error: (err) => {
        console.error('Error loading companies:', err);
      }
    });
  }

  openAppointmentForm(company: any): void {
    this.selectedCompany = company;
    this.showForm = true;
    this.selectedDate = null;
    this.form.reset();
    
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
}
