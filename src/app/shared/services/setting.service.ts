/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Setting } from '../models/setting.interface';

@Injectable()
export class SettingService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/setting`;
  private apiSettingUrl = `${environment.apiBaseUrl}/location`;

  loadSetting(): Observable<Setting> {
    return this.apollo
      .query<any>({
        query: gql`
          query GetSetting {
            getSetting {
              didYouKnow
              terms
              confidentiality
              homeImage1 {
                fileUrl
              }
              homeImage2 {
                fileUrl
              }
              homeImage3 {
                fileUrl
              }
            }
          }
        `,
        fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
        context: {
          uri: this.apiUrl, // Use the updated API URL
        },
      })
      .pipe(map((response) => ({ ...response.data.getSetting })));
  }
}
