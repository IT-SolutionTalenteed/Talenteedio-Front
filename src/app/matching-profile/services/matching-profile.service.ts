import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchingProfileService {
  private apiUrl = `${environment.apiBaseUrl}/matching-profile`;

  constructor(private http: HttpClient) {}

  private graphqlRequest(query: string, variables?: any): Observable<any> {
    return this.http.post(this.apiUrl, {
      query,
      variables: variables || {}
    });
  }

  saveMatchingProfile(input: any): Observable<any> {
    const query = `
      mutation SaveMatchingProfile($input: MatchingProfileInput!) {
        saveMatchingProfile(input: $input) {
          id
          title
          cvText
          interests
          skills
          targetSectorIds
          status
          createdAt
          updatedAt
          cv {
            id
            fileUrl
          }
          currentSector {
            id
            name
          }
        }
      }
    `;
    return this.graphqlRequest(query, { input }).pipe(
      map((response: any) => response.data.saveMatchingProfile)
    );
  }

  getMyMatchingProfiles(): Observable<any[]> {
    const query = `
      query GetMyMatchingProfiles {
        getMyMatchingProfiles {
          id
          title
          status
          createdAt
          updatedAt
          cv {
            id
            fileUrl
          }
          currentSector {
            id
            name
          }
        }
      }
    `;
    return this.graphqlRequest(query).pipe(
      map((response: any) => response.data.getMyMatchingProfiles)
    );
  }

  getMatchingProfile(id: string): Observable<any> {
    const query = `
      query GetMatchingProfile($id: ID!) {
        getMatchingProfile(id: $id) {
          id
          title
          cvText
          interests
          skills
          targetSectorIds
          status
          createdAt
          updatedAt
          cv {
            id
            fileUrl
          }
          currentSector {
            id
            name
          }
        }
      }
    `;
    return this.graphqlRequest(query, { id }).pipe(
      map((response: any) => response.data.getMatchingProfile)
    );
  }

  matchProfileWithCompanies(matchingProfileId: string): Observable<any> {
    const query = `
      mutation MatchProfileWithCompanies($matchingProfileId: ID!) {
        matchProfileWithCompanies(matchingProfileId: $matchingProfileId) {
          success
          matchCount
          message
        }
      }
    `;
    return this.graphqlRequest(query, { matchingProfileId }).pipe(
      map((response: any) => response.data.matchProfileWithCompanies)
    );
  }

  getMatchedCompanies(matchingProfileId: string): Observable<any[]> {
    const query = `
      query GetMatchedCompanies($matchingProfileId: ID!) {
        getMatchedCompanies(matchingProfileId: $matchingProfileId) {
          id
          matchingProfileId
          companyId
          matchScore
          matchDetails {
            overall_match_percentage
            criteria_scores {
              criterion
              score
              explanation
            }
            strengths
            gaps
            recommendation
          }
          isSelected
          createdAt
          company {
            id
            company_name
            logo {
              id
              fileUrl
            }
            category {
              id
              name
            }
            contact {
              id
              address {
                city
                country
              }
            }
          }
        }
      }
    `;
    return this.graphqlRequest(query, { matchingProfileId }).pipe(
      map((response: any) => response.data.getMatchedCompanies)
    );
  }

  toggleCompanySelection(matchId: string, isSelected: boolean): Observable<any> {
    const query = `
      mutation ToggleCompanySelection($matchId: ID!, $isSelected: Boolean!) {
        toggleCompanySelection(matchId: $matchId, isSelected: $isSelected) {
          id
          isSelected
        }
      }
    `;
    return this.graphqlRequest(query, { matchId, isSelected }).pipe(
      map((response: any) => response.data.toggleCompanySelection)
    );
  }

  createCompanyAppointment(input: any): Observable<any> {
    const query = `
      mutation CreateCompanyAppointment($input: CompanyAppointmentInput!) {
        createCompanyAppointment(input: $input) {
          id
          appointmentDate
          appointmentTime
          timezone
          message
          status
          company {
            id
            company_name
            logo {
              id
              fileUrl
            }
          }
        }
      }
    `;
    return this.graphqlRequest(query, { input }).pipe(
      map((response: any) => response.data.createCompanyAppointment)
    );
  }

  getProfileAppointments(matchingProfileId: string): Observable<any[]> {
    const query = `
      query GetProfileAppointments($matchingProfileId: ID!) {
        getProfileAppointments(matchingProfileId: $matchingProfileId) {
          id
          appointmentDate
          appointmentTime
          timezone
          message
          status
          company {
            id
            company_name
            logo {
              id
              fileUrl
            }
            contact {
              id
              address {
                city
              }
            }
          }
        }
      }
    `;
    return this.graphqlRequest(query, { matchingProfileId }).pipe(
      map((response: any) => response.data.getProfileAppointments)
    );
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    const query = `
      mutation CancelAppointment($appointmentId: ID!) {
        cancelAppointment(appointmentId: $appointmentId) {
          id
          status
        }
      }
    `;
    return this.graphqlRequest(query, { appointmentId }).pipe(
      map((response: any) => response.data.cancelAppointment)
    );
  }

  getAvailableSectors(): Observable<any[]> {
    const query = `
      query GetAvailableSectors {
        getAvailableSectors {
          id
          name
        }
      }
    `;
    return this.graphqlRequest(query).pipe(
      map((response: any) => response.data.getAvailableSectors)
    );
  }

  getAvailableSkills(): Observable<any[]> {
    const query = `
      query GetAvailableSkills {
        getAvailableSkills {
          id
          name
        }
      }
    `;
    return this.graphqlRequest(query).pipe(
      map((response: any) => response.data.getAvailableSkills)
    );
  }

  getMyAppointments(): Observable<any[]> {
    const query = `
      query GetMyAppointments {
        getMyAppointments {
          id
          scheduledAt
          status
          notes
          meetingLink
          company {
            id
            company_name
            logo {
              id
              fileUrl
            }
          }
          matchingProfile {
            id
            title
          }
        }
      }
    `;
    return this.graphqlRequest(query).pipe(
      map((response: any) => response.data.getMyAppointments || [])
    );
  }
}
