/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, forkJoin, map } from 'rxjs';
import { SettingService } from 'src/app/shared/services/setting.service';
import { environment } from 'src/environments/environment';
import { AdvisorState } from '../store/reducers/advisor.reducers';

@Injectable()
export class AdvisorService {
  readonly apollo = inject(Apollo);
  readonly sharedService = inject(SettingService);
  private newsApiUrl = `${environment.apiBaseUrl}/article`;
  private jobApiUrl = `${environment.apiBaseUrl}/job`;
  private eventApiUrl = `${environment.apiBaseUrl}/event`;
  private userApiUrl = `${environment.apiBaseUrl}/user`;
  variables = {
    input: {
      limit: 1,
      page: 1,
    },
    filter: { status: 'public' },
  };
  newsQuery() {
    return this.apollo.query<any>({
      query: gql`
        query GetArticles($input: PaginationInput, $filter: ArticleFilter) {
          getArticles(input: $input, filter: $filter) {
            rows {
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
      variables: this.variables,
      fetchPolicy: 'network-only',
      context: {
        uri: this.newsApiUrl,
      },
    });
  }
  jobsQuery() {
    return this.apollo.query<any>({
      query: gql`
        query GetJobs($input: PaginationInput, $filter: JobFilter) {
          getJobs(input: $input, filter: $filter) {
            rows {
              id
              slug
              title
              salaryMin
              salaryMax
              status
              location {
                name
              }
              isFeatured
              isUrgent
              featuredImage {
                fileUrl
              }
              jobType {
                name
              }
              category {
                name
              }
            }
            total
          }
        }
      `,
      variables: this.variables, // You might want to specify the appropriate variables here
      fetchPolicy: 'network-only',
      context: {
        uri: this.jobApiUrl,
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
            total
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
  userQuery() {
    return this.apollo.query<any>({
      query: gql`
        query GetTotalUsers {
          getTotalUsers
        }
      `,
      fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
      context: {
        uri: this.userApiUrl, // Use the updated API URL
      },
    });
  }

  loadAdvisorData(): Observable<Partial<AdvisorState>> {
    return forkJoin({
      news: this.newsQuery(),
      jobs: this.jobsQuery(),
      events: this.eventsQuery(),
      users: this.userQuery(),
    }).pipe(
      map((responses) => ({
        news:
          responses.news.data.getArticles.total > 0
            ? responses.news.data.getArticles.rows[0]
            : undefined,
        popularJob:
          responses.news.data.getArticles.total > 0
            ? responses.jobs.data.getJobs.rows[0]
            : undefined,
        totalJobs: responses.jobs.data.getJobs.total,
        events: responses.events.data.getEvents.rows,
        totalEvents: responses.events.data.getEvents.total,
        totalUsers: responses.users.data.getTotalUsers,
        eventsDates: responses.events.data.getEvents.rows.map(
          (row) => new Date(row.date)
        ),
      }))
    );
  }
}
