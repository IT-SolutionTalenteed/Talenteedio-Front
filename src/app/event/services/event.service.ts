import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Event } from 'src/app/shared/models/event.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { environment } from 'src/environments/environment';
import { EventListCriteria } from '../types/event-list-criteria.interface';

@Injectable()
export class EventService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/event`;
  // eslint-disable-next-line max-lines-per-function
  loadEvents(eventCriteria: EventListCriteria): Observable<Paginated<Event>> {
    const variables = {
      input: {
        limit: eventCriteria.page.pageSize,
        page: eventCriteria.page.page,
        orderBy: eventCriteria.sort.by || 'date',
        direction: eventCriteria.sort.direction || 'desc',
      },
      filter: { title: eventCriteria?.filter?.search, status: 'public' },
    };
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetEvents($input: PaginationInput, $filter: EventFilter) {
              getEvents(input: $input, filter: $filter) {
                rows {
                  id
                  title
                  content
                  createdAt
                  slug
                  date
                }
                total
              }
            }
          `,
          variables,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiUrl, // Use the updated API URL
          },
        })
        .pipe(
          map((response) => ({
            items: response.data.getEvents.rows,
            totalItems: response.data.getEvents.total,
          }))
        )
    );
  }

  // eslint-disable-next-line max-lines-per-function
  loadEvent(id: string): Observable<Event> {
    const variables = {
      input: { slug: id },
    };
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetOneEvent($input: GetOneEventInput) {
              getOneEvent(input: $input) {
                id
                title
                content
                createdAt
                date
                admin {
                  user {
                    name
                  }
                }
                slug
              }
            }
          `,
          variables,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getOneEvent as Event))
    );
  }
}
