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
