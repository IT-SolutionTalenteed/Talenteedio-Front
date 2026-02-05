import { Component, OnInit, OnDestroy } from '@angular/core';
import { faBriefcase, faLaptop } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite, FavoriteType } from '../../types/favorite.interface';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss'],
})
export class FavoriteListComponent implements OnInit, OnDestroy {
  favorites: Favorite[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 12;
  total = 0;
  selectedType: FavoriteType | null = null;

  faBriefcase = faBriefcase;
  faLaptop = faLaptop;

  FavoriteType = FavoriteType;

  private favoriteChangedSubscription?: Subscription;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavorites();
    
    // S'abonner aux changements de favoris pour rafraîchir la liste
    this.favoriteChangedSubscription = this.favoriteService.favoriteChanged$.subscribe(
      () => {
        // Rafraîchir la liste des favoris
        this.loadFavorites();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.favoriteChangedSubscription) {
      this.favoriteChangedSubscription.unsubscribe();
    }
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoriteService
      .getFavorites(this.currentPage, this.pageSize, this.selectedType || undefined)
      .subscribe({
        next: (response) => {
          this.favorites = response.data;
          this.total = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading favorites:', error);
          this.isLoading = false;
        },
      });
  }

  filterByType(type: FavoriteType | null): void {
    this.selectedType = type;
    this.currentPage = 1;
    this.loadFavorites();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }
}
