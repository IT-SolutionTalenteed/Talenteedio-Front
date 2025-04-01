import { Component, Input } from '@angular/core';
import { Testimonial } from 'src/app/shared/models/testimonial.interface';

@Component({
  selector: 'app-card-customer',
  templateUrl: './card-customer.component.html',
  styleUrls: ['./card-customer.component.scss'],
})
export class CardCustomerComponent {
  @Input() testimonial: Testimonial;
}
