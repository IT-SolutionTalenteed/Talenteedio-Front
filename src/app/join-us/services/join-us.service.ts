import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JoinUsForm } from '../types/join-us-form.interface';

@Injectable({
  providedIn: 'root',
})
export class JoinUsService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/join-us`;

  // eslint-disable-next-line max-lines-per-function
  send(props: JoinUsForm & { recaptcha: string }) {
    const customHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Captcha-Response': props.recaptcha, // Replace with the actual value
    });
    return this.apollo
      .query({
        query: gql`
          query joinUs($input: JoinUsForm!) {
            joinUs(input: $input)
          }
        `,
        variables: {
          input: {
            socialReason: props.socialReason,
            address: props.address,
            firstName: props.firstName,
            lastName: props.lastName,
            professionalEmail: props.professionalEmail,
            role: props.role,
            phone: props.phone['internationalNumber'],
            motivation: props.motivation,
            events: props.events.map((e) => ({
              title: e.title,
              slug: e.slug,
            })),
            otherTopics: props.otherTopics,
          },
        },
        fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
        context: {
          uri: this.apiUrl, // Use the updated API URL
          headers: customHeaders, // Include the custom headers
        },
      })
      .pipe(map((response) => response.data as { joinUs: string }));
  }
}
