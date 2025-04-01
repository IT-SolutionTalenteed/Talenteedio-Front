import { Location } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  faFacebookF,
  faLinkedin,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  faChevronRight,
  faCircleUser,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getUserRole } from 'src/app/authentication/store/selectors/authentication.selectors';
import {
  FACEBOOK_SHARE_BASE_URL,
  LINKEDIN_SHARE_BASE_URL,
  TWITTER_SHARE_BASE_URL,
} from 'src/app/shared/constants/shared.constant';
import { Article } from 'src/app/shared/models/article.interface';
import { Role, RoleName } from 'src/app/shared/models/role.interface';
import { openBecomeMemberModal } from 'src/app/shared/store/actions/shared.actions';
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnChanges, OnInit {
  @Input() article: Article;
  icon = faCircleUser;
  fbIcon = faFacebookF;
  twitterIcon = faXTwitter;
  linkedinIcon = faLinkedin;
  content: SafeHtml;
  publicContent: SafeHtml;
  isHrFirstClub$: Observable<boolean>;
  role$: Observable<Role>;
  readMoreIcon = faChevronRight;

  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  premiumIcon = faCrown;

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    private authenticationStore: Store<AuthenticationState>
  ) {
    if (typeof window !== 'undefined') {
      this.facebookUrl =
        FACEBOOK_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.twitterUrl =
        TWITTER_SHARE_BASE_URL + window.location.origin + this.location.path();
      this.linkedinUrl =
        LINKEDIN_SHARE_BASE_URL + window.location.origin + this.location.path();
    }
  }

  ngOnInit() {
    this.role$ = this.authenticationStore.pipe(select(getUserRole));
    this.isHrFirstClub$ = this.role$.pipe(
      map(
        (role) =>
          !!(
            role &&
            (role.name === RoleName.HR_FIRST_CLUB ||
              role.name === RoleName.ADMIN)
          )
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article']) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        this.article?.content ?? ''
      );
      this.publicContent = this.sanitizer.bypassSecurityTrustHtml(
        this.article?.publicContent ?? ''
      );
    }
  }
  openWindow(event: Event, link) {
    event.preventDefault(); // Prevent the default link behavior
    window.open(link, '_blank');
  }

  onReadMore() {
    this.authenticationStore.dispatch(openBecomeMemberModal());
  }
}
