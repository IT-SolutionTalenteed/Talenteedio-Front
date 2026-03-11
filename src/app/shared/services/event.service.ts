import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const GET_FEATURED_EVENT = gql`
  query GetFeaturedEvent {
    getEvents(input: { limit: 100, page: 1 }, filter: { status: "public" }) {
      rows {
        id
        title
        slug
        date
        startTime
        endTime
        location
        image
        featured
        metaDescription
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiBaseUrl}/event`;

  constructor(private apollo: Apollo) {}

  getFeaturedEvent(): Observable<any> {
    return this.apollo
      .query({
        query: GET_FEATURED_EVENT,
        fetchPolicy: 'network-only', // Toujours récupérer les données fraîches
        context: {
          uri: this.apiUrl,
        },
      })
      .pipe(
        map((result: any) => {
          const events = result?.data?.getEvents?.rows || [];
          // Trouver l'événement avec featured: true
          return events.find((event: any) => event.featured === true) || null;
        })
      );
  }
}
