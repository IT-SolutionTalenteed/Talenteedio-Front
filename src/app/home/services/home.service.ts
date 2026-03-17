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
        limit: 50, // Load more companies to ensure we get Solution Talenteed
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
                  id
                  company_name
                  slogan
                  description
                  industry
                  companySize
                  foundedYear
                  website
                  logo {
                    id
                    fileUrl
                  }
                  contact {
                    email
                    address {
                      line
                      city
                      state
                      country
                    }
                  }
                  socialNetworks {
                    linkedin
                    twitter
                    facebook
                  }
                  jobs {
                    id
                  }
                }
              }
            }
          `,
          variables: props,
          fetchPolicy: 'network-only',
          context: {
            uri: this.userApiUrl,
          },
        })
        .pipe(
          map((response) => {
            const companies = response.data.getCompanies.rows;
            console.log('All companies loaded:', companies.map(c => c.company_name));
            
            // Find Solution Talenteed SARL
            const solutionTalenteed = companies.find((c: Company) => 
              c.company_name.toLowerCase().includes('solution talenteed')
            );
            
            // Get other companies (excluding Solution Talenteed)
            const otherCompanies = companies.filter((c: Company) => 
              !c.company_name.toLowerCase().includes('solution talenteed')
            );
            
            // Build final array: Solution Talenteed first, then 2 other companies
            const result: Company[] = [];
            
            if (solutionTalenteed) {
              result.push(solutionTalenteed);
              console.log('Solution Talenteed found and added first:', solutionTalenteed.company_name);
            }
            
            // Add up to 2 more companies to reach a total of 3
            const remainingSlots = 3 - result.length;
            result.push(...otherCompanies.slice(0, remainingSlots));
            
            console.log('Final 3 companies to display:', result.map(c => c.company_name));
            
            return result;
          })
        )
    );
  }

  // eslint-disable-next-line max-lines-per-function
  loadUpcomingEvents(): Observable<any[]> {
    const eventApiUrl = `${environment.apiBaseUrl}/event`;
    const props = {
      input: {
        limit: 10,
        page: 1,
      },
      filter: { status: 'public', featured: true },
    };

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetEvents(
              $input: PaginationInput
              $filter: EventFilter
            ) {
              getEvents(input: $input, filter: $filter) {
                rows {
                  id
                  title
                  slug
                  date
                  startTime
                  endTime
                  location
                  maxParticipants
                  image
                  featured
                  featured
                  companies {
                    id
                    company_name
                    logo {
                      id
                      fileUrl
                    }
                  }
                }
              }
            }
          `,
          variables: props,
          fetchPolicy: 'network-only',
          context: {
            uri: eventApiUrl,
          },
        })
        .pipe(
          map((response) => {
            if (!response?.data?.getEvents?.rows) {
              return [];
            }
            
            const events = response.data.getEvents.rows;
            
            if (events.length === 0) {
              return [];
            }
            
            const now = new Date();
            
            // Filtrer les événements à venir
            const upcomingEvents = events.filter((event: any) => {
              const eventDate = new Date(event.date);
              return eventDate >= now;
            });
            
            if (upcomingEvents.length === 0) {
              return [];
            }
            
            // Trier par date
            upcomingEvents.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            // Séparer l'événement mis en avant des autres
            const featuredEvent = upcomingEvents.find((event: any) => event.featured === true);
            const regularEvents = upcomingEvents.filter((event: any) => event.featured !== true);
            
            // Construire le tableau final
            const result: any[] = [];
            
            if (featuredEvent) {
              result.push({ ...featuredEvent, isFeatured: true });
            }
            
            // Ajouter les événements réguliers pour compléter jusqu'à 3 événements
            const remainingSlots = 3 - result.length;
            result.push(...regularEvents.slice(0, remainingSlots).map(event => ({ ...event, isFeatured: false })));
            
            return result;
          })
        )
    );
  }
}
