import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { faBriefcase, faLaptop, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite, FavoriteType } from '../../types/favorite.interface';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss'],
})
export class FavoriteListComponent implements OnInit, OnDestroy {
  favorites: Favorite[] = [];
  isLoading = false; // Initialisé à false pour permettre le premier chargement
  currentPage = 1;
  pageSize = 12;
  total = 0;
  selectedType: FavoriteType | null = null;

  faBriefcase = faBriefcase;
  faLaptop = faLaptop;
  faMapMarkerAlt = faMapMarkerAlt;

  FavoriteType = FavoriteType;

  private favoriteChangedSubscription?: Subscription;

  constructor(
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {
    console.log('[FavoriteList] Constructor called');
  }

  ngOnInit(): void {
    console.log('[FavoriteList] ngOnInit - START');
    
    // Forcer la fermeture du loader global au cas où NavigationEnd ne se déclenche pas
    console.log('[FavoriteList] Forcing global loader to hide');
    this.loadingService.forceHide();
    
    this.loadFavorites();
    
    // S'abonner aux changements de favoris pour rafraîchir la liste
    this.favoriteChangedSubscription = this.favoriteService.favoriteChanged$.subscribe(
      (change) => {
        console.log('[FavoriteList] favoriteChanged$ received:', change, 'isLoading:', this.isLoading);
        // Recharger uniquement si un favori a changé et qu'on n'est pas déjà en train de charger
        if (!this.isLoading) {
          console.log('[FavoriteList] Reloading favorites due to change');
          this.loadFavorites();
        } else {
          console.log('[FavoriteList] Skipping reload - already loading');
        }
      }
    );
    console.log('[FavoriteList] ngOnInit - END');
  }

  ngOnDestroy(): void {
    console.log('[FavoriteList] ngOnDestroy called');
    if (this.favoriteChangedSubscription) {
      this.favoriteChangedSubscription.unsubscribe();
    }
  }

  loadFavorites(): void {
    console.log('[FavoriteList] loadFavorites called - isLoading:', this.isLoading, 'page:', this.currentPage, 'type:', this.selectedType);
    console.log('[FavoriteList] Current state - favorites count:', this.favorites.length, 'total:', this.total);
    
    // Éviter les appels multiples simultanés
    if (this.isLoading) {
      console.log('[FavoriteList] loadFavorites BLOCKED - already loading');
      return;
    }
    
    this.isLoading = true;
    console.log('[FavoriteList] Starting API call to getFavorites - isLoading NOW TRUE');
    
    const startTime = Date.now();
    this.favoriteService
      .getFavorites(this.currentPage, this.pageSize, this.selectedType || undefined)
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          console.log('[FavoriteList] API response received in', duration, 'ms');
          console.log('[FavoriteList] Response:', {
            dataCount: response.data.length,
            total: response.total,
            page: response.page,
            limit: response.limit
          });
          this.favorites = response.data;
          this.total = response.total;
          this.isLoading = false;
          console.log('[FavoriteList] isLoading set to FALSE - favorites count:', this.favorites.length);
          console.log('[FavoriteList] Template should now show content, not loading');
          
          // Forcer la détection des changements
          this.cdr.detectChanges();
          console.log('[FavoriteList] Change detection triggered');
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('[FavoriteList] Error loading favorites after', duration, 'ms:', error);
          this.isLoading = false;
          console.log('[FavoriteList] isLoading set to FALSE (error)');
          
          // Forcer la détection des changements même en cas d'erreur
          this.cdr.detectChanges();
          console.log('[FavoriteList] Change detection triggered (error)');
        },
      });
  }

  filterByType(type: FavoriteType | null): void {
    console.log('[FavoriteList] filterByType called with:', type);
    this.selectedType = type;
    this.currentPage = 1;
    this.loadFavorites();
  }

  onPageChange(page: number): void {
    console.log('[FavoriteList] onPageChange called with page:', page);
    this.currentPage = page;
    this.loadFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }
}
