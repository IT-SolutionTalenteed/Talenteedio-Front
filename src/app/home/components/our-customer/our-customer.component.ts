import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Testimonial } from 'src/app/shared/models/testimonial.interface';
import { TESTIMONIALS_CAROUSEL_OPTIONS } from '../../constants/home.constant';

@Component({
  selector: 'app-our-customer',
  templateUrl: './our-customer.component.html',
  styleUrls: ['./our-customer.component.scss'],
})
export class OurCustomerComponent implements OnInit {
  @Input() testimonials: Testimonial[];
  ssrtype = false;
  carouselOptions: OwlOptions = TESTIMONIALS_CAROUSEL_OPTIONS;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.ssrtype = true;
    }
  }
}
