import { Component, Input } from '@angular/core';
import { Company } from 'src/app/shared/models/company.interface';
import { faMapMarkerAlt, faBriefcase, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent {
  @Input() company: Company;

  faMapMarker = faMapMarkerAlt;
  faBriefcase = faBriefcase;
  faUsers = faUsers;
}
