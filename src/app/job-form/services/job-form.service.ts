/* eslint-disable max-lines-per-function */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/shared/models/job.interface';
import { environment } from 'src/environments/environment';
import { JobApplyCriteria } from '../types/job-apply-criteria';
import { JobReferCriteria } from '../types/job-refer-criteria';

@Injectable()
export class JobFormService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/job`;
  private apiReferUrl = `${environment.apiBaseUrl}/referred`;
  private apiUserUrl = `${environment.apiBaseUrl}/user`;
  // eslint-disable-next-line max-lines-per-function
  loadJob(id: string): Observable<Job> {
    const variables = {
      input: { slug: id },
    };
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetOneJob($input: GetOneJobInput) {
              getOneJob(input: $input) {
                id
                slug
                title
                content
                expirationDate
                createdAt
                updatedAt
                hours
                hourType
                gender
                salaryMin
                salaryMax
                salaryType
                experience
                recruitmentNumber
                status
                referralLink
                metaDescription
                location {
                  id
                  name
                  address {
                    id
                    line
                    postalCode
                    city
                    country
                    state
                  }
                  status
                }
                isFeatured
                isUrgent
                isSharable
                featuredImage {
                  id
                  fileUrl
                  fileType
                  fileName
                }
                jobType {
                  id
                  name
                  status
                }
                category {
                  id
                  name
                  slug
                  status
                  model
                }
                skills {
                  id
                  name
                  status
                }
                company {
                  id
                  company_name
                }
                hasApplied
              }
            }
          `,
          variables,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getOneJob as Job))
    );
  }

  applyForJob(props: JobApplyCriteria) {
    const mutation = gql`
      mutation ApplyForJob($input: ApplyJobInput) {
        applyForJob(input: $input) {
          success
        }
      }
    `;
    return this.apollo.mutate({
      mutation,
      variables: {
        input: {
          jobId: props.jobId,
          cvId: props.cvId || undefined,
          lmId: props.lmId || undefined,
        },
      },
      fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
      context: {
        uri: this.apiUrl, // Use the updated API URL
      },
    });
  }

  referJob(props: JobReferCriteria) {
    const mutation = gql`
      mutation CreateReferred($input: CreateReferredInput) {
        createReferred(input: $input) {
          id
        }
      }
    `;
    return this.apollo.mutate({
      mutation,
      variables: {
        input: {
          job: { id: props.job.id },
          talentEmail: props.talentEmail,
          talentNumber: props.talentNumber,
          talentFullName: props.talentFullName,
          jobReferenceLink: props.jobReferenceLink,
        },
      },
      fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
      context: {
        uri: this.apiReferUrl, // Use the updated API URL
      },
    });
  }

  matchCVWithJob(cvId: string, jobId: string) {
    const query = gql`
      query MatchCVWithJob($input: MatchCVInput) {
        matchCVWithJob(input: $input) {
          overall_match_percentage
          criteria_scores {
            criterion
            score
            explanation
          }
          strengths
          gaps
          recommendation
        }
      }
    `;
    return this.apollo.query({
      query,
      variables: {
        input: {
          cvId,
          jobId,
        },
      },
      fetchPolicy: 'network-only',
      context: {
        uri: this.apiUrl,
      },
    });
  }
  loadApplyJobCriteria() {
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            {
              getCVs {
                rows {
                  id
                  title
                }
              }
              getLMs {
                rows {
                  id
                  title
                }
              }
            }
          `,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiUserUrl, // Use the updated API URL
          },
        })
        .pipe(
          map((response) => ({
            CVs: response.data.getCVs.rows,
            LMs: response.data.getLMs.rows,
          }))
        )
    );
  }
}
