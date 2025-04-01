/* eslint-disable max-lines-per-function */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationJob } from '../models/location-job.interface';

@Injectable()
export class LocationService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/setting`;
  private apiLocationUrl = `${environment.apiBaseUrl}/location`;

  loadJobLocation(): Observable<LocationJob[]> {
    const props = {
      input: {
        limit: null,
        page: null,
      },
      filter: {
        status: 'public',
      },
    };

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetLocations(
              $input: PaginationInput
              $filter: LocationFilter
            ) {
              getLocations(input: $input, filter: $filter) {
                rows {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            input: props.input,
            filter: props.filter,
          },
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiLocationUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getLocations.rows))
    );
  }
}
