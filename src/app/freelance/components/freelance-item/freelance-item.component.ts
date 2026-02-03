import { Component, Input, OnInit } from '@angular/core';
import {
  faBriefcase,
  faClock,
  faLocationDot,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Job } from 'src/app/shared/models/job.interface';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-freelance-item',
  templateUrl: './freelance-item.component.html',
  styleUrls: ['./freelance-item.component.scss'],
})
export class FreelanceItemComponent implements OnInit {
  @Input() job: Job;
  @Input() isReferral: boolean;
  
  user$: Observable<User>;
  
  fabriefcase = faBriefcase;
  faMapMarker = faLocationDot;
  faClock = faClock;
  faMoney = faMoneyBill;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(getLoggedUser));
  }
}
