import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface JobMatchScore {
  jobId: string;
  jobTitle: string;
  matchPercentage: number;
  strengths: string[];
  gaps: string[];
}

export interface CompanyMatchScore {
  companyId: string;
  companyName: string;
  companyLogo: string | null;
  companyDescription: string;
  companySector: string;
  matchPercentage: number;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  matchingJobs: JobMatchScore[];
}

export interface MatchingResult {
  matches: CompanyMatchScore[];
  totalCompaniesAnalyzed: number;
  message: string;
}

const MATCH_TALENT_WITH_COMPANIES = gql`
  mutation MatchTalentWithCompanies($userId: String!, $cvText: String) {
    matchTalentWithCompanies(userId: $userId, cvText: $cvText)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  constructor(private apollo: Apollo) {}

  /**
   * Matcher un talent avec toutes les companies et leurs jobs
   */
  matchTalentWithCompanies(userId: string, cvText?: string): Observable<MatchingResult> {
    return this.apollo
      .mutate({
        mutation: MATCH_TALENT_WITH_COMPANIES,
        variables: { userId, cvText }
      })
      .pipe(
        map((result: any) => {
          const data = JSON.parse(result.data.matchTalentWithCompanies);
          return data as MatchingResult;
        })
      );
  }
}
