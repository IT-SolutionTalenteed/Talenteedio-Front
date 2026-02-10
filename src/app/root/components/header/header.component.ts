import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { logOut } from 'src/app/authentication/store/actions/authentication.actions';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { Ad } from 'src/app/shared/models/ad.interface';
import { User } from 'src/app/shared/models/user.interface';
import { nthOccurenceOf } from 'src/app/shared/utils/string';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { Menu } from '../../types/menu.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { TranslationService, Language } from 'src/app/services/translation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnDestroy, OnChanges, OnInit {
  connexionTime: string;
  currentRoute: string;
  showUserDropdown = false;
  showLanguageDropdown = false;
  menusCopy: Menu[];
  isShowingMobileNav = false;
  hoveredMenu: Menu | null = null;
  activeMobileSubmenu: Menu | null = null;
  currentLanguage: Language = 'fr';

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
    private elementRef: ElementRef,
    private categoryService: CategoryService,
    private translationService: TranslationService
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

  ngOnInit(): void {
    this.loadEventCategories();
    
    // Initialiser la langue
    this.subs.sink = this.translationService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['user'] || changes['menus']) && this.menus) {
      this.menusCopy = this.menus.filter((menu) => menu.title !== 'Logout');
    }
    if (changes['navbarMenus'] && this.navbarMenus) {
      this.loadEventCategories();
    }
  }

  loadEventCategories(): void {
    if (!this.navbarMenus) return;
    
    this.subs.sink = this.categoryService.getEventCategories().subscribe({
      next: (categories) => {
        const eventMenu = this.navbarMenus.find(menu => menu.title === 'Événements');
        if (eventMenu && eventMenu.subMenus) {
          // Ajouter les catégories après "Tous nos événements"
          const categoryMenus = categories.map(category => ({
            title: category.name,
            routerLink: `/event/category/${category.slug}`,
            icon: 'tag',
            description: category.subtitle || `Événements ${category.name}`
          }));
          
          // Garder "Tous nos événements" et ajouter les catégories
          eventMenu.subMenus = [
            eventMenu.subMenus[0], // Tous nos événements
            ...categoryMenus
          ];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onMenuHover(menu: Menu) {
    if (menu.megaMenu) {
      this.hoveredMenu = menu;
    }
  }

  onMenuLeave() {
    this.hoveredMenu = null;
  }

  toggleMobileSubmenu(menu: Menu) {
    this.activeMobileSubmenu = this.activeMobileSubmenu === menu ? null : menu;
  }

  onToggleNavbar() {
    this.isShowingMobileNav = !this.isShowingMobileNav;
    if (!this.isShowingMobileNav) {
      this.activeMobileSubmenu = null;
    }
  }

  toggleLanguageDropdown() {
    this.showLanguageDropdown = !this.showLanguageDropdown;
    if (this.showLanguageDropdown) {
      this.showUserDropdown = false;
    }
  }

  changeLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
    this.showLanguageDropdown = false;
  }

  logout() {
    if (this.user) {
      this.authenticationStore.dispatch(logOut());
    }
  }

  goToDashboard(event: Event) {
    event.preventDefault();
    
    this.authenticationStore
      .pipe(
        select((state: any) => ({
          accessToken: state?.auth?.token,
          refreshToken: state?.auth?.refreshToken,
          user: state?.auth?.user
        })),
        take(1)
      )
      .subscribe(data => {
        if (data.accessToken) {
          const isConsultant = data.user?.consultant && !data.user?.admin;
          const adminUrl = 'http://localhost:5173/admin';
          
          let url = isConsultant ? adminUrl : this.backOfficeRoute;
          url += `?accessToken=${data.accessToken}`;
          if (data.refreshToken) {
            url += `&refreshToken=${data.refreshToken}`;
          }
          window.location.href = url;
        }
      });
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) {
      this.showLanguageDropdown = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInside = this.elementRef.nativeElement.contains(target);
    if (!isInside) {
      this.showUserDropdown = false;
      this.showLanguageDropdown = false;
      this.hoveredMenu = null;
    }
  }
}
