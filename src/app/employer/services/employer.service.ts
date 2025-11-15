import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';

@Injectable()
export class EmployerService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/job`;

  createJob(input: { title: string; slug: string; content: string; expirationDate: string }) {
    const mutation = gql`
      mutation CreateJob($input: CreateJobInput) {
        createJob(input: $input) {
          id
          title
          slug
        }
      }
    `;
    return this.apollo.mutate({
      mutation,
      variables: {
        input: {
          ...input,
          isFeatured: false,
          isUrgent: false,
          isSharable: true,
        },
      },
      context: {
        uri: this.apiUrl,
      },
      fetchPolicy: 'network-only',
    });
  }
}

