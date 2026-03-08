import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  /**
   * Récupère une donnée du cache
   * @param key Clé du cache
   * @returns Les données ou null si expiré/inexistant
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }
    
    // Vérifier si le cache est expiré
    if (Date.now() - cached.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Stocke une donnée dans le cache
   * @param key Clé du cache
   * @param data Données à stocker
   */
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Supprime une entrée du cache ou tout le cache
   * @param key Clé à supprimer (optionnel)
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Vérifie si une clé existe dans le cache
   * @param key Clé à vérifier
   * @returns true si la clé existe et n'est pas expirée
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Définit la durée du cache
   * @param duration Durée en millisecondes
   */
  setCacheDuration(duration: number): void {
    this.cacheDuration = duration;
  }
}
