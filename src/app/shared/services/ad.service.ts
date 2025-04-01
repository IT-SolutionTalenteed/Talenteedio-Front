/* eslint-disable max-lines-per-function */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ad } from '../models/ad.interface';

@Injectable()
export class AdService {
  constructor(private apollo: Apollo) {}

  private apiAdUrl = `${environment.apiBaseUrl}/ad`;

  loadAd(): Observable<Ad> {
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetActiveAd {
              getActiveAd {
                id
                title
                link
                image {
                  fileUrl
                }
              }
            }
          `,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiAdUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getActiveAd))
    );
  }
}
