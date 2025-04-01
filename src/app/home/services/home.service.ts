import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Company } from 'src/app/shared/models/company.interface';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Partner } from 'src/app/shared/models/partner.interface';
import { Testimonial } from 'src/app/shared/models/testimonial.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class HomeService {
  constructor(private apollo: Apollo) {}

  private testimonialApiUrl = `${environment.apiBaseUrl}/testimonial`;
  private userApiUrl = `${environment.apiBaseUrl}/user`;
  private partnerApiUrl = `${environment.apiBaseUrl}/partner`;
  private interviewApiUrl = `${environment.apiBaseUrl}/interview`;

  // eslint-disable-next-line max-lines-per-function
  loadTestimonials(): Observable<Testimonial[]> {
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
            query GetTestimonials(
              $input: PaginationInput
              $filter: TestimonialFilter
            ) {
              getTestimonials(input: $input, filter: $filter) {
                rows {
                  id
                  name
                  comment
                  jobPosition
                }
              }
            }
          `,
          variables: props,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.testimonialApiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getTestimonials.rows))
    );
  }

  interviewsQuery() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        input: {
          limit: 1,
          page: 1,
        },
        filter: { status: 'public' },
      }, // You might want to specify the appropriate variables here
      fetchPolicy: 'network-only',
      context: {
        uri: this.interviewApiUrl,
      },
    });
  }

  loadInterview(): Observable<Interview[]> {
    return this.interviewsQuery().pipe(
      map((response) => response.data.getInterviews.rows)
    );
  }

  // eslint-disable-next-line max-lines-per-function
  loadPartners(): Observable<Partner[]> {
    const props = {
      filter: { status: 'public' },
    };

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetPartners($input: PaginationInput, $filter: PartnerFilter) {
              getPartners(input: $input, filter: $filter) {
                rows {
                  image {
                    fileUrl
                  }
                  link
                }
              }
            }
          `,
          variables: { filter: { status: 'public' } }, // You might want to specify the appropriate variables here
          fetchPolicy: 'network-only',
          context: {
            uri: this.partnerApiUrl,
          },
        })
        .pipe(map((response) => response.data.getPartners.rows))
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
}
