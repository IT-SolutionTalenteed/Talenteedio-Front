import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { logOut } from 'src/app/authentication/store/actions/authentication.actions';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { Ad } from 'src/app/shared/models/ad.interface';
import { User } from 'src/app/shared/models/user.interface';
import { nthOccurenceOf } from 'src/app/shared/utils/string';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { Menu } from '../../types/menu.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy, OnChanges {
  connexionTime: string;
  currentRoute: string;
  showUserDropdown = false;
  menusCopy: Menu[];
  isShowingMobileNav = false;

  backOfficeRoute = environment.backOfficeBaseUrl;

  @Input() user: User;
  @Input() companyName: string;
  @Input() companyLogo: string;
  @Input() menus: Menu[];
  @Input() currentUrl: string;
  @Input() navbarMenus: Menu[];
  @Input() ad: Ad;

  icon = faCircleUser;

  private subs = new SubSink();

  constructor(
    private authenticationStore: Store<AuthenticationState>,
    router: Router,
    private elementRef: ElementRef
  ) {
    this.currentRoute = router.url.slice(0, nthOccurenceOf('/', 3, router.url));
    this.subs.sink = router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((v) => {
        const result = (v as NavigationStart).url;
        return (this.currentRoute = result.slice(
          0,
          nthOccurenceOf('/', 3, result)
        ));
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['user'] || changes['menus']) && this.menus) {
      this.menusCopy = this.menus.filter((menu) => menu.title !== 'Logout');
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onToggleNavbar() {
    this.isShowingMobileNav = !this.isShowingMobileNav;
  }
  // navigateToProfilePage() {
  //     this.authenticationStore.dispatch(go({ path: [USER_PROFILE_BASE_ROUTE] }));
  // }

  logout() {
    if (this.user) {
      this.authenticationStore.dispatch(logOut());
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInside = this.elementRef.nativeElement.contains(target);
    if (!isInside) {
      this.showUserDropdown = false;
    }
  }
}
