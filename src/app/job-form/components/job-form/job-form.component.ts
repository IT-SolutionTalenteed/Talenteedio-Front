import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  faFacebookF,
  faLinkedin,
  faPinterest,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  faBriefcase,
  faCalendar,
  faClock,
  faHourglass,
  faLocationDot,
  faMoneyBill,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import {
  FACEBOOK_SHARE_BASE_URL,
  LINKEDIN_SHARE_BASE_URL,
  PINTEREST_SHARE_BASE_URL,
  TWITTER_SHARE_BASE_URL,
} from 'src/app/shared/constants/shared.constant';
import { Job } from 'src/app/shared/models/job.interface';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnChanges {
  @Output() login: EventEmitter<void> = new EventEmitter<void>();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() refer: EventEmitter<void> = new EventEmitter<void>();
  @Output() match: EventEmitter<void> = new EventEmitter<void>();
  @Input() job: Job;
  @Input() user: User;
  isExperatedJob = false;
  fabriefcase = faBriefcase;
  faMapMarker = faLocationDot;
  faClock = faClock;
  faMoney = faMoneyBill;
  faCalendar = faCalendar;
  faHourglass = faHourglass;
  faUser = faUser;
  faUsers = faUsers;
  content: SafeHtml;
  fbIcon = faFacebookF;
  twitterIcon = faXTwitter;
  pinterestIcon = faPinterest;
  linkedinIcon = faLinkedin;
  facebookUrl: string;
  twitterUrl: string;
  pinterestUrl: string;
  linkedinUrl: string;
  favoriteType: 'job' = 'job';
  
  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    private gaService: GoogleAnalyticsService
  ) {
    if (typeof window !== 'undefined') {
      this.facebookUrl =
        FACEBOOK_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.twitterUrl =
        TWITTER_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.pinterestUrl =
        PINTEREST_SHARE_BASE_URL +
        window.location.origin +
        this.location.path();
      this.linkedinUrl =
        LINKEDIN_SHARE_BASE_URL + window.location.origin + this.location.path();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isExperatedJob = new Date(this.job?.expirationDate) < new Date();
    if (changes['job']) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        this.job?.content ?? ''
      );
      // Déterminer le type basé sur l'URL ou le jobType
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        this.favoriteType = 'job';
      }
    }
  }

  openWindow(event: Event, link) {
    event.preventDefault(); // Prevent the default link behavior
    window.open(link, '_blank');
  }

  onApply() {
    this.apply.emit();
  }

  onMatch() {
    this.match.emit();
  }
}
