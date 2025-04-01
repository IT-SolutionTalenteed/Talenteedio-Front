import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, of } from 'rxjs';
import { EMPTY_JOB } from 'src/app/job/constants/job.constant';
import { Company } from 'src/app/shared/models/company.interface';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { SettingService } from 'src/app/shared/services/setting.service';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { environment } from 'src/environments/environment';
import {
  DATE_POSTED_TRANSLATION,
  EXPERIENCE_LEVEL_FILTER_TRANSLATION,
} from '../constants/job-list.constant';
import { JobListCriteria } from '../types/job-list-criteria.interface';
import { JobListServiceInterface } from './job-list-service.interface';

@Injectable()
export class JobListService implements JobListServiceInterface {
  constructor(private apollo: Apollo) {}

  readonly sharedService = inject(SettingService);

  private jobApiUrl = `${environment.apiBaseUrl}/job`;
  private jobTypeApiUrl = `${environment.apiBaseUrl}/job-type`;
  private categoryApiUrl = `${environment.apiBaseUrl}/category`;
  private userApiUrl = `${environment.apiBaseUrl}/user`;

  // eslint-disable-next-line max-lines-per-function
  loadJobs(criteria: JobListCriteria): Observable<Paginated<Job>> {
    const props = {
      input: {
        limit: criteria.page.pageSize,
        page: criteria.page.page,
      },
      filter: {
        search: criteria?.filter?.search,
        location: criteria?.filter?.location,
        category: criteria?.filter?.category,
        datePosted: criteria?.filter?.datePosted
          ? DATE_POSTED_TRANSLATION[criteria?.filter?.datePosted]
          : undefined,
        isFeatured: criteria?.filter?.isFeatured,
        experienceLevels:
          criteria?.filter?.experienceLevels !== ''
            ? EXPERIENCE_LEVEL_FILTER_TRANSLATION[
                criteria?.filter?.experienceLevels
              ]
            : undefined,
        jobTypes: criteria?.filter?.jobTypes,
        status: 'public',
      },
    };

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetJobs($input: PaginationInput, $filter: JobFilter) {
              getJobs(input: $input, filter: $filter) {
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
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.jobApiUrl, // Use the updated API URL
          },
        })
        .pipe(
          map((response) => ({
            items: response.data.getJobs.rows,
            totalItems: response.data.getJobs.total,
          }))
        )
    );
  }

  // eslint-disable-next-line max-lines-per-function
  loadJobTypes(): Observable<JobType[]> {
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

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.jobTypeApiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getJobTypes.rows))
    );
  }

  // eslint-disable-next-line max-lines-per-function
  loadCategories(): Observable<Category[]> {
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

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.categoryApiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getCategories.rows))
    );
  }

  // eslint-disable-next-line max-lines-per-function
  loadCompanies(): Observable<Company[]> {
    const props = {
      input: {
        limit: 3,
        page: 1,
      },
      filter: { status: 'public' },
    };

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetCompanies(
              $input: PaginationInput
              $filter: CompanyFilter
            ) {
              getCompanies(input: $input, filter: $filter) {
                rows {
                  company_name
                  logo {
                    id
                    fileUrl
                  }
                  contact {
                    address {
                      line
                      city
                      state
                      country
                    }
                  }
                }
              }
            }
          `,
          variables: props,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.userApiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getCompanies.rows))
    );
  }

  loadDidYouKnow(): Observable<string> {
    return this.sharedService
      .loadSetting()
      .pipe(map((response) => response.didYouKnow));
  }

  jobFactory(): Observable<Job> {
    return of(EMPTY_JOB);
  }
}
