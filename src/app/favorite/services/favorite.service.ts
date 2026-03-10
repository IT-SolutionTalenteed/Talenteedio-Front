import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, Subject, BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Favorite, FavoriteResponse, FavoritesResource, FavoriteType } from '../types/favorite.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favoriteApiUrl = `${environment.apiBaseUrl}/favorite`;
  private favoriteChangedSubject = new Subject<{ itemId: string; type: FavoriteType; isFavorite: boolean }>();
  
  // BehaviorSubject pour le compteur - PUBLIC pour debug
  public favoritesCountSubject = new BehaviorSubject<number>(0);
  
  // Observable pour que les composants puissent s'abonner aux changements
  public favoriteChanged$ = this.favoriteChangedSubject.asObservable();
  public favoritesCount$ = this.favoritesCountSubject.asObservable();

  constructor(private apollo: Apollo) {}

  // Méthode pour mettre à jour le compteur
  public updateFavoritesCount(count: number): void {
    this.favoritesCountSubject.next(count);
  }

  // Méthode pour recharger le compteur depuis l'API
  public refreshFavoritesCount(): Observable<number> {
    return this.apollo
      .query<any>({
        query: gql`
          query GetFavoritesCount {
            getFavorites(input: { page: 1, limit: 1 }) {
              total
            }
          }
        `,
        fetchPolicy: 'network-only',
        context: {
          uri: this.favoriteApiUrl,
        },
      })
      .pipe(
        map((result) => result.data.getFavorites.total || 0),
        tap((count) => {
          this.updateFavoritesCount(count);
        })
      );
  }

  getFavorites(page: number = 1, limit: number = 10, type?: FavoriteType): Observable<FavoritesResource> {
    return this.apollo
      .query<any>({
        query: gql`
          query GetFavorites($input: PaginationInput, $type: FavoriteType) {
            getFavorites(input: $input, type: $type) {
              data {
                id
                type
                createdAt
                job {
                  id
                  slug
                  title
                  updatedAt
                  salaryMin
                  salaryMax
                  isFeatured
                  isUrgent
                  isSharable
                  location {
                    name
                  }
                  category {
                    name
                  }
                  jobType {
                    name
                  }
                  featuredImage {
                    fileUrl
                  }
                  company {
                    id
                    company_name
                  }
                }
              }
              total
              page
              limit
            }
          }
        `,
        variables: {
          input: { page, limit },
          type,
        },
        fetchPolicy: 'network-only',
        context: {
          uri: this.favoriteApiUrl,
        },
      })
      .pipe(map((result) => result.data.getFavorites));
  }

  getRecentFavorites(limit: number = 3): Observable<Favorite[]> {
    return this.apollo
      .query<any>({
        query: gql`
          query GetRecentFavorites($limit: Int) {
            getRecentFavorites(limit: $limit) {
              id
              type
              createdAt
              job {
                id
                slug
                title
                updatedAt
                isFeatured
                isUrgent
                location {
                  name
                }
                category {
                  name
                }
                featuredImage {
                  fileUrl
                }
              }
            }
          }
        `,
        variables: { limit },
        fetchPolicy: 'network-only',
        context: {
          uri: this.favoriteApiUrl,
        },
      })
      .pipe(map((result) => result.data.getRecentFavorites));
  }

  isFavorite(itemId: string, type: FavoriteType): Observable<boolean> {
    return this.apollo
      .query<any>({
        query: gql`
          query IsFavorite($itemId: ID!, $type: FavoriteType!) {
            isFavorite(itemId: $itemId, type: $type)
          }
        `,
        variables: { itemId, type },
        fetchPolicy: 'network-only',
        context: {
          uri: this.favoriteApiUrl,
        },
      })
      .pipe(map((result) => result.data.isFavorite));
  }

  toggleFavorite(itemId: string, type: FavoriteType): Observable<FavoriteResponse> {
    return this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ToggleFavorite($input: AddFavoriteInput!) {
            toggleFavorite(input: $input) {
              success
              message
              favorite {
                id
                type
                createdAt
              }
            }
          }
        `,
        variables: {
          input: { itemId, type },
        },
        context: {
          uri: this.favoriteApiUrl,
        },
      })
      .pipe(
        tap((result) => {
          const response = result.data.toggleFavorite;
          const isFavorite = response.favorite !== null;
          
          // Recharger le compteur depuis l'API immédiatement
          this.refreshFavoritesCount().subscribe();
          
          // Notifier les composants du changement
          this.favoriteChangedSubject.next({
            itemId,
            type,
            isFavorite
          });
        }),
        map((result) => result.data.toggleFavorite)
      );
  }

  addFavorite(itemId: string, type: FavoriteType): Observable<FavoriteResponse> {
    return this.apollo
      .mutate<any>({
        mutation: gql`
          mutation AddFavorite($input: AddFavoriteInput!) {
            addFavorite(input: $input) {
              success
              message
              favorite {
                id
                type
                createdAt
              }
            }
          }
        `,
        variables: {
          input: { itemId, type },
        },
        context: {
          uri: this.favoriteApiUrl,
        },
      })
      .pipe(
        tap((result) => {
          const response = result.data.addFavorite;
          if (response.success) {
            // Recharger le compteur
            this.refreshFavoritesCount().subscribe();
            
            // Notifier les composants du changement
            this.favoriteChangedSubject.next({
              itemId,
              type,
              isFavorite: true
            });
          }
        }),
        map((result) => result.data.addFavorite)
      );
  }

  removeFavorite(itemId: string, type: FavoriteType): Observable<FavoriteResponse> {
    return this.apollo
      .mutate<any>({
        mutation: gql`
          mutation RemoveFavorite($input: RemoveFavoriteInput!) {
            removeFavorite(input: $input) {
              success
              message
            }
          }
        `,
        variables: {
          input: { itemId, type },
        },
        context: {
          uri: this.favoriteApiUrl,
        },
      })
      .pipe(
        tap((result) => {
          const response = result.data.removeFavorite;
          if (response.success) {
            // Recharger le compteur
            this.refreshFavoritesCount().subscribe();
            
            // Notifier les composants du changement
            this.favoriteChangedSubject.next({
              itemId,
              type,
              isFavorite: false
            });
          }
        }),
        map((result) => result.data.removeFavorite)
      );
  }
}
