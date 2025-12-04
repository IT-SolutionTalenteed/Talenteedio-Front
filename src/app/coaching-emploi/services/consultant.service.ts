import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface ConsultantPricing {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
}

export interface Consultant {
  id: string;
  user: {
    firstname: string;
    lastname: string;
  };
  title: string;
  expertise: string;
  yearsOfExperience: number;
  pricings?: ConsultantPricing[];
}

@Injectable({
  providedIn: 'root',
})
export class ConsultantService {
  constructor(private apollo: Apollo) {}

  getConsultants(): Observable<Consultant[]> {
    return this.apollo
      .query<any>({
        query: gql`
          query GetConsultants($input: PaginationInput, $filter: ConsultantFilter) {
            getConsultants(input: $input, filter: $filter) {
              rows {
                id
                user {
                  firstname
                  lastname
                }
                title
                expertise
                yearsOfExperience
              }
            }
          }
        `,
        variables: {
          input: {
            limit: 100,
            page: 1,
            orderBy: 'createdAt',
            direction: 'ASC',
          },
          filter: {
            status: 'public',
          },
        },
        fetchPolicy: 'network-only',
        context: {
          uri: `${environment.apiBaseUrl}/user`,
        },
      })
      .pipe(map((response) => response.data.getConsultants.rows));
  }

  getPricings(consultantId: string): Observable<ConsultantPricing[]> {
    return this.apollo
      .query<any>({
        query: gql`
          query GetPricings($consultantId: ID!) {
            getPricings(consultantId: $consultantId) {
              rows {
                id
                title
                description
                price
                unit
              }
            }
          }
        `,
        variables: {
          consultantId,
        },
        fetchPolicy: 'network-only',
        context: {
          uri: `${environment.apiBaseUrl}/pricing`,
        },
      })
      .pipe(map((response) => response.data.getPricings.rows));
  }
}
