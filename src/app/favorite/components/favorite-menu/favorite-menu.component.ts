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
  isLoading = true;
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
    console.log('[FavoriteMenu] Component initialized');
    
    // S'abonner au compteur pour mise à jour en temps réel
    this.favoriteChangedSubscription = this.favoriteService.favoritesCount$.subscribe(
      (count) => {
        console.log('[FavoriteMenu] Count received:', count);
        this.favoritesCount = count;
        this.cdr.detectChanges();
      }
    );
    
    // Charger le compteur initial depuis l'API
    this.favoriteService.refreshFavoritesCount().subscribe({
      next: (count) => {
        console.log('[FavoriteMenu] Initial count loaded:', count);
      },
      error: (error) => {
        console.error('[FavoriteMenu] Error loading initial count:', error);
      }
    });
    
    // Charger les favoris récents
    this.loadRecentFavorites();
    
    // S'abonner aux changements de favoris pour rafraîchir la liste
    const changeSubscription = this.favoriteService.favoriteChanged$.subscribe(
      (change) => {
        console.log('[FavoriteMenu] Favorite changed event received!', change);
        // Rafraîchir la liste des favoris récents
        this.loadRecentFavorites();
      }
    );
    
    this.favoriteChangedSubscription.add(changeSubscription);
  }

  ngOnDestroy(): void {
    if (this.favoriteChangedSubscription) {
      this.favoriteChangedSubscription.unsubscribe();
    }
  }

  loadRecentFavorites(): void {
    this.isLoading = true;
    this.favoriteService.getRecentFavorites(3).subscribe({
      next: (favorites) => {
        this.recentFavorites = favorites;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recent favorites:', error);
        this.isLoading = false;
      },
    });
  }

  loadFavoritesCount(): void {
    // Cette méthode n'est plus nécessaire, on utilise refreshFavoritesCount() du service
    this.favoriteService.refreshFavoritesCount().subscribe({
      next: (count) => {
        console.log('[FavoriteMenu] Count loaded:', count);
      },
      error: (error) => {
        console.error('[FavoriteMenu] Error loading favorites count:', error);
      },
    });
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
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
