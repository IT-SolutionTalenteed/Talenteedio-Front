import { Component, Input } from '@angular/core';
import {
  faBriefcase,
  faClock,
  faLocationDot,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { Job } from 'src/app/shared/models/job.interface';

@Component({
  selector: 'app-freelance-item',
  templateUrl: './freelance-item.component.html',
  styleUrls: ['./freelance-item.component.scss'],
})
export class FreelanceItemComponent {
  @Input() job: Job;
  @Input() isReferral: boolean;
  fabriefcase = faBriefcase;
  faMapMarker = faLocationDot;
  faClock = faClock;
  faMoney = faMoneyBill;
}
