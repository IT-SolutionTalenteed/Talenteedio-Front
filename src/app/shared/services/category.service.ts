import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Category {
  id: string;
  name: string;
  slug: string;
  model: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiBaseUrl}/category`;

  constructor(private apollo: Apollo) {}

  getEventCategories(): Observable<Category[]> {
    return this.apollo
      .query<any>({
        query: gql`
          query GetEventCategories($filter: CategoryFilter) {
            getCategories(filter: $filter) {
              rows {
                id
                name
                slug
                model
                status
              }
            }
          }
        `,
        variables: {
          filter: {
            model: 'Event',
            status: 'public',
            operation: 'AND'
          }
        },
        fetchPolicy: 'network-only',
        context: {
          uri: this.apiUrl,
        },
      })
      .pipe(
        map((response) => response.data.getCategories.rows as Category[])
      );
  }
}
