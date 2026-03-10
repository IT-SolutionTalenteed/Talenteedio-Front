import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;

  /**
   * Observable du statut de chargement
   */
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Affiche le loader
   */
  show(): void {
    this.loadingCount++;
    console.log('[LoadingService] show() called - count:', this.loadingCount);
    if (this.loadingCount === 1) {
      console.log('[LoadingService] Activating global loader');
      this.loadingSubject.next(true);
    }
  }

  /**
   * Cache le loader
   */
  hide(): void {
    this.loadingCount--;
    console.log('[LoadingService] hide() called - count:', this.loadingCount);
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      console.log('[LoadingService] Deactivating global loader');
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force le loader à se cacher
   */
  forceHide(): void {
    console.log('[LoadingService] forceHide() called - previous count:', this.loadingCount);
    this.loadingCount = 0;
    this.loadingSubject.next(false);
    console.log('[LoadingService] Global loader force hidden');
  }

  /**
   * Retourne le statut actuel du loader
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
