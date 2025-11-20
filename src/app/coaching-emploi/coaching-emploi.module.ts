import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoachingEmploiRoutingModule } from './coaching-emploi-routing.module';
import { CoachingEmploiComponent } from './coaching-emploi.component';
import { ConsultantsComponent } from './containers/consultants/consultants.component';
import { ServicesComponent } from './containers/services/services.component';
import { BookingComponent } from './containers/booking/booking.component';
import { SuccessComponent } from './containers/success/success.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [
    CoachingEmploiComponent,
    ConsultantsComponent,
    ServicesComponent,
    BookingComponent,
    SuccessComponent,
    ContactModalComponent,
    BookingModalComponent,
    CalendarComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CoachingEmploiRoutingModule],
})
export class CoachingEmploiModule {}
