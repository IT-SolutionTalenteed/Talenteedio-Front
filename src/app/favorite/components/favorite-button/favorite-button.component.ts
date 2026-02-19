import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';
import { FavoriteType } from '../../types/favorite.interface';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss'],
})
export class FavoriteButtonComponent implements OnInit, OnDestroy {
  @Input() itemId!: string;
  @Input() type!: FavoriteType | 'job';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  isFavorite = false;
  isLoading = false;

  faHeartSolid = faHeartSolid;
  faHeartRegular = faHeartRegular;

  private favoriteChangedSubscription?: Subscription;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.checkFavoriteStatus();
    
    // S'abonner aux changements de favoris pour synchroniser l'état
    this.favoriteChangedSubscription = this.favoriteService.favoriteChanged$.subscribe(
      (change) => {
        if (change.itemId === this.itemId && change.type === this.type) {
          this.isFavorite = change.isFavorite;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.favoriteChangedSubscription) {
      this.favoriteChangedSubscription.unsubscribe();
    }
  }

  checkFavoriteStatus(): void {
    this.favoriteService.isFavorite(this.itemId, this.type as FavoriteType).subscribe({
      next: (result) => {
        this.isFavorite = result;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      },
    });
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isLoading) return;

    this.isLoading = true;
    const previousState = this.isFavorite;

    // Optimistic update
    this.isFavorite = !this.isFavorite;

    this.favoriteService.toggleFavorite(this.itemId, this.type as FavoriteType).subscribe({
      next: (response) => {
        // Le service notifiera automatiquement tous les composants
        if (!response.success) {
          // Revert on failure
          this.isFavorite = previousState;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        // Revert on error
        this.isFavorite = previousState;
        this.isLoading = false;
      },
    });
  }
}
