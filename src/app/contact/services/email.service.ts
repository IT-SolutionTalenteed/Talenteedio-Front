import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactEmail } from '../types/contact-email.interface';

@Injectable()
export class EmailService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/mailer`;
  sendEmail(
    props: ContactEmail & { to: string }
  ): Observable<{ sendMail: string }> {
    const customHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Captcha-Response': props.recaptcha, // Replace with the actual value
    });
    return this.apollo
      .query({
        query: gql`
          query SendMail(
            $to: String
            $subject: String
            $message: String!
            $name: String!
            $email: String!
          ) {
            sendMail(
              to: $to
              subject: $subject
              message: $message
              name: $name
              email: $email
            )
          }
        `,
        variables: props,
        fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
        context: {
          uri: this.apiUrl, // Use the updated API URL
          headers: customHeaders, // Include the custom headers
        },
      })
      .pipe(map((response) => response.data as { sendMail: string }));
  }
}
