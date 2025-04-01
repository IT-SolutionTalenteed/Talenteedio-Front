/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, forkJoin, map } from 'rxjs';
import { Role, RoleName } from 'src/app/shared/models/role.interface';
import { SettingService } from 'src/app/shared/services/setting.service';
import { environment } from 'src/environments/environment';
import { CommunityState } from '../store/reducers/community.reducers';

@Injectable()
export class CommunityService {
  readonly apollo = inject(Apollo);
  readonly sharedService = inject(SettingService);
  private newsApiUrl = `${environment.apiBaseUrl}/article`;
  private eventApiUrl = `${environment.apiBaseUrl}/event`;
  variables = {
    input: {
      limit: 3,
      page: 1,
    },
    filter: { status: 'public' },
  };
  newsQuery(userRole: Role) {
    return this.apollo.query<any>({
      query: gql`
        query GetArticles($input: PaginationInput, $filter: ArticleFilter) {
          getArticles(input: $input, filter: $filter) {
            rows {
              id
              image {
                id
                fileUrl
              }
              title
              content
              publicContent
              createdAt
              slug
              isPremium
            }
            total
          }
        }
      `,
      variables:
        userRole?.name === RoleName.ADMIN ||
        userRole?.name === RoleName.HR_FIRST_CLUB
          ? {
              ...this.variables,
              filter: {
                ...this.variables.filter,
                isPremium:
                  userRole?.name === RoleName.ADMIN ||
                  userRole?.name === RoleName.HR_FIRST_CLUB,
              },
            }
          : this.variables,
      fetchPolicy: 'network-only',
      context: {
        uri: this.newsApiUrl,
      },
    });
  }

  eventsQuery() {
    return this.apollo.query<any>({
      query: gql`
        query GetEvents($input: PaginationInput, $filter: EventFilter) {
          getEvents(input: $input, filter: $filter) {
            rows {
              id
              slug
              title
              content
              date
            }
          }
        }
      `,
      variables: {
        ...this.variables,
        input: {
          orderBy: 'date',
          direction: 'desc',
        },
      }, // You might want to specify the appropriate variables here
      fetchPolicy: 'network-only',
      context: {
        uri: this.eventApiUrl,
      },
    });
  }

  loadCommunityData(userRole: Role): Observable<Partial<CommunityState>> {
    return forkJoin({
      news: this.newsQuery(userRole),
      events: this.eventsQuery(),
    }).pipe(
      map((responses) => ({
        news: responses.news.data.getArticles.rows,
        events: responses.events.data.getEvents.rows,
        eventsDates: responses.events.data.getEvents.rows.map(
          (row) => new Date(row.date)
        ),
      }))
    );
  }
}
