import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Store, select } from '@ngrx/store';
import { map, pipe } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { getAccessToken } from './../../../authentication/store/selectors/authentication.selectors';

import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { setUser } from 'src/app/authentication/store/actions/authentication.actions';

import { Title } from '@angular/platform-browser';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import {
  getIsAuthenticationRoute,
  getIsBackOfficeRoute,
  getTitle,
  getUrl,
} from 'src/app/routeur/store/selectors/router.selectors';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Ad } from 'src/app/shared/models/ad.interface';
import { Contact } from 'src/app/shared/models/contact.interface';
import { User } from 'src/app/shared/models/user.interface';
import {
  closeBecomeMemberModal,
  loadAd,
  loadLocation,
  loadLocations,
} from 'src/app/shared/store/actions/shared.actions';
import { SharedState } from 'src/app/shared/store/reducers/shared.reducers';
import {
  getAd,
  getIsBecomeMemberModalOpen,
  getLocation,
} from 'src/app/shared/store/selectors/shared.selectors';
import { subscribeModal } from 'src/app/shared/utils/modal.utils';
import { SubSink } from 'subsink';
import { NAVAR_MENUS } from '../../constants/navbar-menu.constants';
import { SIDE_NAV_MENU } from '../../constants/side-nav-menu.constants';
import { Menu } from '../../types/menu.interface';
import { filterHeaderMenusDependingOnUserRight } from '../../utils/menu-filter.utils';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, OnDestroy {
  headerMenu$: Observable<Menu[]>;
  user$: Observable<User>;
  currentUrl$: Observable<string>;
  sideMenus$: Observable<Menu[]>;
  location$: Observable<Contact | null>;
  ad$: Observable<Ad | null>;
  isBackOfficeRoute = false;
  isHomeRoute$: Observable<boolean>;
  isAuthenticationRoute = false;
  accessToken: string;
  navbarMenus = NAVAR_MENUS;
  @ViewChild('becomeMemberModal', { static: true })
  becomeMemberModal: ModalComponent;
  userPlus = faUserPlus;

  private subs = new SubSink();
  private lastFocusTime = Date.now();

  // eslint-disable-next-line max-params
  constructor(
    private authenticationStore: Store<AuthenticationState>,
    private routerStore: Store<AppRouterState>,
    private sharedStore: Store<SharedState>,
    private titleService: Title,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.initTitle();
    this.initAuthentication();
    this.initSideMenu();
    this.initUrlUtils();
    this.initData();
    this.initToken();
    this.subscribeModals();
    this.location$ = this.sharedStore.pipe(select(getLocation));
    this.ad$ = this.sharedStore.pipe(select(getAd));
  }

  @HostListener('window:focus', ['$event'])
  onWindowFocus(event: FocusEvent): void {
    const now = Date.now();
    const timeSinceLastFocus = now - this.lastFocusTime;
    
    if (timeSinceLastFocus > 5000 && this.accessToken) {
      this.refreshUserData();
    }
    
    this.lastFocusTime = now;
  }

  @HostListener('window:blur', ['$event'])
  onWindowBlur(event: FocusEvent): void {
    this.lastFocusTime = Date.now();
  }

  private refreshUserData(): void {
    this.authenticationService.me().subscribe({
      next: (response) => {
        if (response?.user) {
          this.authenticationStore.dispatch(setUser(response.user));
        }
      },
      error: (error) => {
        console.error('Error refreshing user data:', error);
      }
    });
  }
  initToken() {
    this.subs.sink = this.authenticationStore
      .pipe(select(getAccessToken))
      .subscribe((token) => {
        this.accessToken = token;
      });
  }
  initTitle() {
    this.routerStore.pipe(select(getTitle)).subscribe((title) => {
      this.titleService.setTitle(`${title} | Talenteed`);
    });
  }

  initAuthentication() {
    this.user$ = this.authenticationStore.pipe(select(getLoggedUser));
  }

  initSideMenu() {
    this.sideMenus$ = this.authenticationStore.pipe(
      select(getLoggedUser),
      map((user: User) =>
        filterHeaderMenusDependingOnUserRight(SIDE_NAV_MENU, user)
      )
    );
  }

  initUrlUtils() {
    this.currentUrl$ = this.routerStore.select(pipe(getUrl));
    this.subs.sink = this.authenticationStore
      .pipe(select(getIsBackOfficeRoute))
      .subscribe((isBackOfficeRoute) => {
        this.isBackOfficeRoute = isBackOfficeRoute;
      });
    this.subs.sink = this.authenticationStore
      .pipe(select(getIsAuthenticationRoute))
      .subscribe((isAuthenticationRoute) => {
        this.isAuthenticationRoute = isAuthenticationRoute;
      });
  }

  initData() {
    this.sharedStore.dispatch(loadLocation());
    this.sharedStore.dispatch(loadLocations());
    this.sharedStore.dispatch(loadAd());
  }

  onBecomeMember() {
    this.becomeMemberModal.close();
    this.routerStore.dispatch(go({ path: ['/become-member'] }));
  }
  private subscribeModals() {
    subscribeModal(
      this.sharedStore,
      getIsBecomeMemberModalOpen,
      true,
      this.becomeMemberModal
    );
    this.becomeMemberModal.closing.subscribe(() =>
      this.sharedStore.dispatch(closeBecomeMemberModal())
    );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
