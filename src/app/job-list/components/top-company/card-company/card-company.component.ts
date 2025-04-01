import { Component, Input } from '@angular/core';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Company } from 'src/app/shared/models/company.interface';

@Component({
  selector: 'app-card-company',
  templateUrl: './card-company.component.html',
  styleUrls: ['./card-company.component.scss'],
})
export class CardCompanyComponent {
  @Input() company: Company;
  faMapMarker = faLocationDot;
}
