import { Component, Input } from '@angular/core';
import {
  faBriefcase,
  faClock,
  faLocationDot,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { Job } from 'src/app/shared/models/job.interface';

@Component({
  selector: 'app-advisor-popular-job',
  templateUrl: './advisor-popular-job.component.html',
  styleUrls: ['./advisor-popular-job.component.scss'],
})
export class AdvisorPopularJobComponent {
  @Input() popularJob: Partial<Job>;
  fabriefcase = faBriefcase;
  faMapMarker = faLocationDot;
  faClock = faClock;
  faMoney = faMoneyBill;
}
