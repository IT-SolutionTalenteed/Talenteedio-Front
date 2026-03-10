import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { faHeart, faClock, faMapMarker, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../types/favorite.interface';

@Component({
  selector: 'app-favorite-menu',
  templateUrl: './favorite-menu.component.html',
  styleUrls: ['./favorite-menu.component.scss'],
})
export class FavoriteMenuComponent implements OnInit, OnDestroy {
  recentFavorites: Favorite[] = [];
  favoritesCount: number = 0;
  isLoading = false; // Initialisé à false pour permettre le premier chargement
  isOpen = false;

  faHeart = faHeart;
  faClock = faClock;
  faMapMarker = faMapMarker;
  faBriefcase = faBriefcase;

  private favoriteChangedSubscription?: Subscription;

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    console.log('[FavoriteMenu] Constructor called');
  }

  ngOnInit(): void {
    console.log('[FavoriteMenu] ngOnInit - START');
    
    // S'abonner au compteur pour mise à jour en temps réel
    this.favoriteChangedSubscription = this.favoriteService.favoritesCount$.subscribe(
      (count) => {
        console.log('[FavoriteMenu] favoritesCount$ received:', count);
        this.favoritesCount = count;
        this.cdr.detectChanges();
      }
    );
    
    // Charger le compteur initial depuis l'API
    console.log('[FavoriteMenu] Calling refreshFavoritesCount');
    this.favoriteService.refreshFavoritesCount().subscribe();
    
    // S'abonner aux changements de favoris pour rafraîchir la liste
    const changeSubscription = this.favoriteService.favoriteChanged$.subscribe(
      (change) => {
        console.log('[FavoriteMenu] favoriteChanged$ received:', change, 'isOpen:', this.isOpen, 'isLoading:', this.isLoading);
        // Recharger uniquement si le menu est ouvert
        if (this.isOpen && !this.isLoading) {
          console.log('[FavoriteMenu] Reloading recent favorites');
          this.loadRecentFavorites();
        }
      }
    );
    
    this.favoriteChangedSubscription.add(changeSubscription);
    console.log('[FavoriteMenu] ngOnInit - END');
  }

  ngOnDestroy(): void {
    console.log('[FavoriteMenu] ngOnDestroy called');
    if (this.favoriteChangedSubscription) {
      this.favoriteChangedSubscription.unsubscribe();
    }
  }

  loadRecentFavorites(): void {
    console.log('[FavoriteMenu] loadRecentFavorites called - isLoading:', this.isLoading);
    
    // Éviter les appels multiples simultanés
    if (this.isLoading) {
      console.log('[FavoriteMenu] loadRecentFavorites BLOCKED - already loading');
      return;
    }
    
    this.isLoading = true;
    console.log('[FavoriteMenu] Starting API call to getRecentFavorites');
    
    const startTime = Date.now();
    this.favoriteService.getRecentFavorites(3).subscribe({
      next: (favorites) => {
        const duration = Date.now() - startTime;
        console.log('[FavoriteMenu] API response received in', duration, 'ms - count:', favorites.length);
        this.recentFavorites = favorites;
        this.isLoading = false;
        console.log('[FavoriteMenu] isLoading set to false');
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.error('[FavoriteMenu] Error after', duration, 'ms:', error);
        this.isLoading = false;
        console.log('[FavoriteMenu] isLoading set to false (error)');
      },
    });
  }

  loadFavoritesCount(): void {
    this.favoriteService.refreshFavoritesCount().subscribe();
  }

  toggleMenu(): void {
    console.log('[FavoriteMenu] toggleMenu called - current isOpen:', this.isOpen);
    this.isOpen = !this.isOpen;
    console.log('[FavoriteMenu] toggleMenu - new isOpen:', this.isOpen);
    
    if (this.isOpen && !this.isLoading) {
      console.log('[FavoriteMenu] Menu opened - loading recent favorites');
      this.loadRecentFavorites();
    }
  }

  goToFavorites(): void {
    this.isOpen = false;
    this.router.navigate(['/favorites']);
  }

  goToItem(favorite: Favorite): void {
    this.isOpen = false;
    if (favorite.job) {
      this.router.navigate(['/job/detail', favorite.job.slug]);
    }
  }

  getItemTitle(favorite: Favorite): string {
    return favorite.job?.title || '';
  }

  getItemLocation(favorite: Favorite): string {
    return favorite.job?.location?.name || '-';
  }

  getItemCategory(favorite: Favorite): string {
    return favorite.job?.category?.name || '-';
  }

  getItemImage(favorite: Favorite): string {
    return favorite.job?.featuredImage?.fileUrl || 'assets/img/favicon.png';
  }
}
