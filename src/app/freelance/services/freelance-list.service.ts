import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { environment } from 'src/environments/environment';
import { FreelanceListCriteria } from '../types/freelance-list-criteria.interface';

const DATE_POSTED_TRANSLATION = {
  ALL: undefined,
  LAST_HOUR: 1,
  LAST_24_HOURS: 24,
  LAST_7_DAYS: 168,
  LAST_14_DAYS: 336,
  LAST_30_DAYS: 720,
};

@Injectable()
export class FreelanceListService {
  constructor(private apollo: Apollo) {}

  private jobFreelanceApiUrl = `${environment.apiBaseUrl}/jobfreelance`;
  private jobTypeApiUrl = `${environment.apiBaseUrl}/job-type`;
  private categoryApiUrl = `${environment.apiBaseUrl}/category`;

  getFreelanceJobs(criteria: FreelanceListCriteria): Observable<any> {
    const props = {
      input: {
        limit: criteria.page.pageSize,
        page: criteria.page.page,
      },
      filter: {
        search: criteria?.filter?.search || undefined,
        location: criteria?.filter?.location || undefined,
        category: criteria?.filter?.category || undefined,
        datePosted: criteria?.filter?.datePosted
          ? DATE_POSTED_TRANSLATION[criteria?.filter?.datePosted]
          : undefined,
        isFeatured: criteria?.filter?.isFeatured || undefined,
        experienceLevels: criteria?.filter?.experienceLevels || undefined,
        jobTypes: criteria?.filter?.jobTypes?.length > 0 
          ? criteria?.filter?.jobTypes 
          : undefined,
      },
    };

    return this.apollo
      .query<any>({
        query: gql`
          query GetFreelanceJobs($input: PaginationInput, $filter: FreelanceJobFilter) {
            getFreelanceJobs(input: $input, filter: $filter) {
              rows {
                id
                slug
                title
                createdAt
                updatedAt
                salaryMin
                salaryMax
                status
                isSharable
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
              limit
              page
            }
          }
        `,
        variables: props,
        fetchPolicy: 'network-only',
        context: {
          uri: this.jobFreelanceApiUrl,
        },
      })
      .pipe(
        map((response) => ({
          data: response.data.getFreelanceJobs.rows,
          totalItems: response.data.getFreelanceJobs.total,
        }))
      );
  }

  getJobTypes(): Observable<JobType[]> {
    const props = {
      input: {
        limit: null,
        page: null,
      },
      filter: {
        name: '',
        status: '',
      },
    };

    return this.apollo
      .query<any>({
        query: gql`
          query GetJobTypes($input: PaginationInput, $filter: JobTypeFilter) {
            getJobTypes(input: $input, filter: $filter) {
              rows {
                id
                name
                status
              }
            }
          }
        `,
        variables: props,
        fetchPolicy: 'network-only',
        context: {
          uri: this.jobTypeApiUrl,
        },
      })
      .pipe(map((response) => response.data.getJobTypes.rows));
  }

  getJobCategories(): Observable<Category[]> {
    const props = {
      input: {
        limit: null,
        page: null,
      },
      filter: {
        name: '',
        status: '',
        model: 'Job',
      },
    };

    return this.apollo
      .query<any>({
        query: gql`
          query GetCategories(
            $input: PaginationInput
            $filter: CategoryFilter
          ) {
            getCategories(input: $input, filter: $filter) {
              rows {
                id
                name
                status
                model
                slug
              }
            }
          }
        `,
        variables: props,
        fetchPolicy: 'network-only',
        context: {
          uri: this.categoryApiUrl,
        },
      })
      .pipe(map((response) => response.data.getCategories.rows));
  }

  getCompanies(): Observable<Company[]> {
    // Pour l'instant, on retourne un tableau vide car cette méthode nécessite une API différente
    // qui n'est pas encore migrée vers GraphQL
    return new Observable((observer) => {
      observer.next([]);
      observer.complete();
    });
  }

  getDidYouKnow(): Observable<string> {
    // Pour l'instant, on retourne null car cette méthode nécessite une API différente
    // qui n'est pas encore migrée vers GraphQL
    return new Observable((observer) => {
      observer.next(null);
      observer.complete();
    });
  }
}
