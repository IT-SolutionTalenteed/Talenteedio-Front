/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { environment } from 'src/environments/environment';
import { InterviewListCriteria } from '../types/interview-list-criteria.interface';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  readonly apollo = inject(Apollo);
  private interviewApiUrl = `${environment.apiBaseUrl}/interview`;

  loadInterviews(
    interviewListCriteria: InterviewListCriteria
  ): Observable<Paginated<Interview>> {
    const variables = {
      input: {
        limit: interviewListCriteria.page.pageSize,
        page: interviewListCriteria.page.page,
        orderBy: 'date',
        direction: 'desc',
      },
      filter: {
        title: interviewListCriteria?.filter?.search,
        status: 'public',
      },
    };
    return this.apollo
      .query<any>({
        query: gql`
          query GetInterviews(
            $input: PaginationInput
            $filter: InterviewFilter
          ) {
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
              total
            }
          }
        `,
        variables, // You might want to specify the appropriate variables here
        fetchPolicy: 'network-only',
        context: {
          uri: this.interviewApiUrl,
        },
      })
      .pipe(
        map((response) => ({
          items: response.data.getInterviews.rows,
          totalItems: response.data.getInterviews.total,
        }))
      );
  }
  loadInterview(id: string): Observable<Interview> {
    const variables = {
      input: { slug: id },
    };
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetOneInterview($input: GetOneInterviewInput) {
              getOneInterview(input: $input) {
                id
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
          `,
          variables,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.interviewApiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getOneInterview as Interview))
    );
  }
}
