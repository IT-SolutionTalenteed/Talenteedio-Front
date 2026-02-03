import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('[FavoriteMenu] Component initialized');
    
    // Charger les favoris récents
    this.loadRecentFavorites();
    
    // Charger le compteur initial
    this.loadFavoritesCount();
    
    // S'abonner au compteur via BehaviorSubject
    this.favoriteChangedSubscription = this.favoriteService.favoritesCount$.subscribe(
      (count) => {
        if (count >= 0) { // Ignorer la valeur initiale -1
          console.log('[FavoriteMenu] Count changed via BehaviorSubject:', count);
          this.ngZone.run(() => {
            this.favoritesCount = count;
            console.log('[FavoriteMenu] favoritesCount updated to:', this.favoritesCount);
          });
        }
      }
    );
    
    // S'abonner aux changements de favoris pour rafraîchir la liste
    const changeSubscription = this.favoriteService.favoriteChanged$.subscribe(
      (change) => {
        console.log('[FavoriteMenu] Favorite changed event received!', change);
        // Rafraîchir la liste
        this.loadRecentFavorites();
        // Recharger le compteur
        this.loadFavoritesCount();
      }
    );
    
    // Ajouter à la subscription pour cleanup
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
    console.log('[FavoriteMenu] Loading favorites count...');
    this.favoriteService.getFavorites(1, 1).subscribe({
      next: (response) => {
        const newCount = response.total || 0;
        console.log('[FavoriteMenu] Received count from API:', newCount);
        // Mettre à jour le BehaviorSubject dans le service
        this.favoriteService.updateFavoritesCount(newCount);
      },
      error: (error) => {
        console.error('[FavoriteMenu] Error loading favorites count:', error);
        this.favoriteService.updateFavoritesCount(0);
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
