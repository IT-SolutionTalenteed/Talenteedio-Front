import { Location } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  faFacebookF,
  faLinkedin,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import {
  FACEBOOK_SHARE_BASE_URL,
  LINKEDIN_SHARE_BASE_URL,
  TWITTER_SHARE_BASE_URL,
} from 'src/app/shared/constants/shared.constant';
import { Interview } from 'src/app/shared/models/interview.interface';

@Component({
  selector: 'app-interview-detail',
  templateUrl: './interview-detail.component.html',
  styleUrls: ['./interview-detail.component.scss'],
})
export class InterviewDetailComponent implements OnChanges {
  @Input() interview: Interview;
  icon = faCircleUser;
  fbIcon = faFacebookF;
  twitterIcon = faXTwitter;
  linkedinIcon = faLinkedin;
  content: SafeHtml;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  constructor(private sanitizer: DomSanitizer, private location: Location) {
    if (typeof window !== 'undefined') {
      this.facebookUrl =
        FACEBOOK_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.twitterUrl =
        TWITTER_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.linkedinUrl =
        LINKEDIN_SHARE_BASE_URL + window.location.origin + this.location.path();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['interview']) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        this.interview?.content ?? ''
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openWindow(interview: any, link) {
    interview.printerviewDefault(); // Printerview the default link behavior
    window.open(link, '_blank');
  }
}
