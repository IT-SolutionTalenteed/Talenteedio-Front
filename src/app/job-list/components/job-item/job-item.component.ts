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
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
})
export class JobItemComponent implements OnInit {
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

  getClientDescription(): string {
    if (!this.job?.content) {
      return '';
    }

    // Extract CLIENT section from content
    const content = this.job.content;
    const clientMatch = content.match(/CLIENT:\s*(.*?)(?=MISSIONS:|PROFILE:|OUR OFFER:|$)/is);
    
    if (clientMatch && clientMatch[1]) {
      // Remove HTML tags and clean up
      const cleanText = clientMatch[1]
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      return cleanText;
    }

    // Fallback: return first 200 characters of content
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanContent.substring(0, 200);
  }
}
