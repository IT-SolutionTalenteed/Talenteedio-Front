import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
})
export class BookingModalComponent implements OnInit {
  @Input() serviceType: 'bilan' | 'accompagnement';
  @Input() consultantName: string;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  bookingForm: FormGroup;
  selectedDate: Date | null = null;
  timezone: string;
  timeSlots: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  constructor(private fb: FormBuilder) {
    // Obtenir le fuseau horaire de l'utilisateur
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    this.timezone = `UTC ${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  ngOnInit() {
    const formConfig: any = {
      date: ['', Validators.required],
      time: ['', Validators.required],
    };

    if (this.serviceType === 'accompagnement') {
      formConfig.frequency = ['weekly', Validators.required];
    }

    this.bookingForm = this.fb.group(formConfig);
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    const formattedDate = date.toISOString().split('T')[0];
    this.bookingForm.patchValue({ date: formattedDate });
  }

  selectTime(time: string) {
    this.bookingForm.patchValue({ time });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.submit.emit({
        serviceType: this.serviceType,
        ...this.bookingForm.value
      });
    }
  }
}
