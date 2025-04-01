/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, forkJoin, map } from 'rxjs';
import { HrVoiceState } from 'src/app/hr-voice/store/reducers/hr-voice.reducers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HrVoiceService {
  readonly apollo = inject(Apollo);
  private newsApiUrl = `${environment.apiBaseUrl}/article`;
  private interviewApiUrl = `${environment.apiBaseUrl}/interview`;
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
              createdAt
              slug
              isPremium
              publicContent
            }
          }
        }
      `,
      variables: {
        input: {
          page: 1,
          limit: 3,
        },
        filter: { status: 'public', category: 'interview' },
      },
      fetchPolicy: 'network-only',
      context: {
        uri: this.newsApiUrl,
      },
    });
  }

  interviewsQuery() {
    return this.apollo.query<any>({
      query: gql`
        query GetInterviews($input: PaginationInput, $filter: InterviewFilter) {
          getInterviews(input: $input, filter: $filter) {
            rows {
              title
              slug
              content
              date
              videoSrc
              guests {
                name
              }
            }
          }
        }
      `,
      variables: {
        ...this.variables,
        input: {
          ...this.variables.input,
          limit: 5,
          orderBy: 'date',
          direction: 'desc',
        },
      }, // You might want to specify the appropriate variables here
      fetchPolicy: 'network-only',
      context: {
        uri: this.interviewApiUrl,
      },
    });
  }

  loadHrVoiceData(): Observable<Partial<HrVoiceState>> {
    return forkJoin({
      news: this.newsQuery(),
      interviews: this.interviewsQuery(),
    }).pipe(
      map((responses) => ({
        news: responses.news.data.getArticles.rows,
        interview: [
          responses.interviews.data.getInterviews.rows.length >= 1
            ? responses.interviews.data.getInterviews.rows[0]
            : undefined,
          responses.interviews.data.getInterviews.rows.length >= 2
            ? responses.interviews.data.getInterviews.rows[1]
            : undefined,
        ].filter((interview) => interview !== undefined),
        replay: [
          responses.interviews.data.getInterviews.rows.length >= 3
            ? responses.interviews.data.getInterviews.rows[2]
            : undefined,
          responses.interviews.data.getInterviews.rows.length >= 4
            ? responses.interviews.data.getInterviews.rows[3]
            : undefined,
          responses.interviews.data.getInterviews.rows.length >= 5
            ? responses.interviews.data.getInterviews.rows[4]
            : undefined,
        ].filter((interview) => interview !== undefined),
      }))
    );
  }
}
