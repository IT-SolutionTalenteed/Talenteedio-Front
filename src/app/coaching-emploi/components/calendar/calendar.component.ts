import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'];
  monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
    let firstDayOfWeek = firstDay.getDay();
    // Convertir pour que lundi soit 0
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.calendarDays = [];
    
    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        date,
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        isDisabled: true,
      });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = date.getTime() === today.getTime();
      const isSelected = this.selectedDate ? 
        date.getTime() === new Date(this.selectedDate).setHours(0, 0, 0, 0) : 
        false;
      const isDisabled = date < today;
      
      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: true,
        isSelected,
        isToday,
        isDisabled,
      });
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - this.calendarDays.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        isDisabled: true,
      });
    }
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  selectDate(calendarDay: CalendarDay) {
    if (calendarDay.isDisabled) return;
    
    this.selectedDate = calendarDay.date;
    this.generateCalendar();
    this.dateSelected.emit(calendarDay.date);
  }

  get currentMonthYear(): string {
    return `${this.monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }
}
