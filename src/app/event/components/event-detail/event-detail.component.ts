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
import { Event } from 'src/app/shared/models/event.interface';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnChanges {
  @Input() event: Event;
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
    if (changes['event']) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        this.event?.content ?? ''
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openWindow(event: any, link) {
    event.preventDefault(); // Prevent the default link behavior
    window.open(link, '_blank');
  }
}
