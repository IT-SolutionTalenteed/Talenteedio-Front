import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, Subject, BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Favorite, FavoriteResponse, FavoritesResource, FavoriteType } from '../types/favorite.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favoriteApiUrl = `${environment.apiBaseUrl}/favorite`;
  private favoriteChangedSubject = new Subject<{ itemId: string; type: FavoriteType; isFavorite: boolean }>();
  
  // BehaviorSubject pour le compteur - commence à -1 pour indiquer "pas encore chargé"
  private favoritesCountSubject = new BehaviorSubject<number>(-1);
  
  // Observable pour que les composants puissent s'abonner aux changements
  public favoriteChanged$ = this.favoriteChangedSubject.asObservable().pipe(share());
  public favoritesCount$ = this.favoritesCountSubject.asObservable();

  constructor(private apollo: Apollo) {
    console.log('[FavoriteService] Service initialized');
  }

  // Méthode pour mettre à jour le compteur
  public updateFavoritesCount(count: number): void {
    console.log('[FavoriteService] Updating count to:', count);
    this.favoritesCountSubject.next(count);
  }

  // Méthode pour obtenir le compteur actuel
  public getCurrentCount(): number {
    return this.favoritesCountSubject.value;
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
        map((result) => {
          const response = result.data.toggleFavorite;
          console.log('[FavoriteService] toggleFavorite response:', response);
          
          // Notifier les composants du changement
          console.log('[FavoriteService] About to emit favoriteChanged event');
          console.log('[FavoriteService] favoriteChangedSubject observers:', (this.favoriteChangedSubject as any).observers?.length || 0);
          
          this.favoriteChangedSubject.next({
            itemId,
            type,
            isFavorite: response.favorite !== null
          });
          
          console.log('[FavoriteService] favoriteChanged event emitted');
          
          // Mettre à jour le compteur immédiatement
          const currentCount = this.getCurrentCount();
          const newCount = response.favorite !== null ? currentCount + 1 : currentCount - 1;
          console.log('[FavoriteService] Updating count from', currentCount, 'to', newCount);
          this.updateFavoritesCount(Math.max(0, newCount));
          
          return response;
        })
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
        map((result) => {
          const response = result.data.addFavorite;
          // Notifier les composants du changement
          if (response.success) {
            this.favoriteChangedSubject.next({
              itemId,
              type,
              isFavorite: true
            });
          }
          return response;
        })
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
        map((result) => {
          const response = result.data.removeFavorite;
          // Notifier les composants du changement
          if (response.success) {
            this.favoriteChangedSubject.next({
              itemId,
              type,
              isFavorite: false
            });
          }
          return response;
        })
      );
  }
}
