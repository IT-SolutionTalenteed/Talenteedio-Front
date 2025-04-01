import { Component, Input } from '@angular/core';
import {
  faBriefcase,
  faClock,
  faLocationDot,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { Job } from 'src/app/shared/models/job.interface';
@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
})
export class JobItemComponent {
  @Input() job: Job;
  fabriefcase = faBriefcase;
  faMapMarker = faLocationDot;
  faClock = faClock;
  faMoney = faMoneyBill;
}
