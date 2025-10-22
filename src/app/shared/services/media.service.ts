import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Picture } from '../models/picture';

const UPLOAD_IMAGE = gql`
  mutation UploadImage($input: Upload!) {
    uploadImage(input: $input) {
      id
      fileUrl
      fileName
      fileType
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiMediaUrl = `${environment.apiBaseUrl}/media`;

  constructor(private apollo: Apollo) {}

  uploadImage(file: File): Observable<Picture> {
    return this.apollo.mutate({
      mutation: UPLOAD_IMAGE,
      variables: { input: file },
      context: {
        uri: this.apiMediaUrl,
        useMultipart: true
      }
    }).pipe(
      map((result: any) => result.data.uploadImage)
    );
  }
}
