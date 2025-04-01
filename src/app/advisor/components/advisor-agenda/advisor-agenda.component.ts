import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-advisor-agenda',
  templateUrl: './advisor-agenda.component.html',
  styleUrls: ['./advisor-agenda.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvisorAgendaComponent {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @Output() selectDate = new EventEmitter<Date>();
  minDate = new Date();
  selectedDates: Date[];
  @Input() set eventsDates(values: Date[]) {
    this.selectedDates = values;
    setTimeout(() => {
      this.calendar.updateTodaysDate();
    });
  }

  isSelected = (event: Date) =>
    this.selectedDates.find((x) => x.toDateString() === event.toDateString())
      ? 'selected'
      : null;
  onSelectChange(date: Date) {
    this.selectDate.emit(date);
  }
}
