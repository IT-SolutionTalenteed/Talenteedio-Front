import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatchingProfileService } from 'src/app/matching-profile/services/matching-profile.service';

@Injectable({
  providedIn: 'root'
})
export class FeaturedEventMatchingService {
  constructor(
    private matchingProfileService: MatchingProfileService,
    private http: HttpClient
  ) {}

  /**
   * Récupère les résultats de matching filtrés pour les entreprises de l'événement
   * Note: Le matching doit avoir été lancé au préalable avec matchProfileWithCompanies(profileId, eventId)
   */
  matchWithEventCompanies(
    matchingProfileId: string,
    eventCompanyIds: string[]
  ): Observable<any[]> {
    // Ne pas relancer le matching, juste récupérer les résultats déjà calculés
    return this.matchingProfileService.getMatchedCompanies(matchingProfileId).pipe(
      map(matches => {
        // Filtrer uniquement les entreprises participant à l'événement
        return matches.filter((match: any) => 
          eventCompanyIds.includes(match.company.id)
        ).sort((a, b) => {
          // Trier par score de matching décroissant
          const scoreA = a.matchDetails?.overall_match_percentage || 0;
          const scoreB = b.matchDetails?.overall_match_percentage || 0;
          return scoreB - scoreA;
        });
      })
    );
  }

  /**
   * Crée des rendez-vous multiples pour les entreprises sélectionnées
   */
  createMultipleAppointments(
    appointments: Array<{
      companyId: string;
      matchingProfileId: string;
      appointmentDate: string;
      appointmentTime: string;
      timezone: string;
      message: string;
    }>
  ): Observable<any[]> {
    const appointmentObservables = appointments.map(appointment =>
      this.matchingProfileService.createCompanyAppointment(appointment)
    );
    
    return forkJoin(appointmentObservables);
  }

  /**
   * Récupère les statistiques de matching pour l'événement
   */
  getEventMatchingStats(
    matchingProfileId: string,
    eventCompanyIds: string[]
  ): Observable<{
    totalMatches: number;
    averageScore: number;
    topMatches: any[];
  }> {
    return this.matchingProfileService.getMatchedCompanies(matchingProfileId).pipe(
      map(matches => {
        const eventMatches = matches.filter((match: any) => 
          eventCompanyIds.includes(match.company.id)
        );

        const scores = eventMatches.map((match: any) => 
          match.matchDetails?.overall_match_percentage || 0
        );

        const averageScore = scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

        const topMatches = eventMatches
          .sort((a, b) => {
            const scoreA = a.matchDetails?.overall_match_percentage || 0;
            const scoreB = b.matchDetails?.overall_match_percentage || 0;
            return scoreB - scoreA;
          })
          .slice(0, 3);

        return {
          totalMatches: eventMatches.length,
          averageScore: Math.round(averageScore),
          topMatches
        };
      })
    );
  }

  /**
   * Vérifie si l'utilisateur a déjà participé à cet événement
   */
  hasUserParticipated(
    matchingProfileId: string,
    eventCompanyIds: string[]
  ): Observable<boolean> {
    return this.matchingProfileService.getProfileAppointments(matchingProfileId).pipe(
      map(appointments => {
        return appointments.some((appointment: any) => 
          eventCompanyIds.includes(appointment.company.id)
        );
      })
    );
  }

  /**
   * Récupère les rendez-vous liés à l'événement
   */
  getEventAppointments(
    matchingProfileId: string,
    eventCompanyIds: string[]
  ): Observable<any[]> {
    return this.matchingProfileService.getProfileAppointments(matchingProfileId).pipe(
      map(appointments => {
        return appointments.filter((appointment: any) => 
          eventCompanyIds.includes(appointment.company.id)
        );
      })
    );
  }

  /**
   * Récupère les jobs publiés par les entreprises participantes à l'événement
   */
  getEventCompanyJobs(eventCompanyIds: string[]): Observable<any[]> {
    // Note: Cette query n'existe pas encore dans le backend
    // Pour l'instant, on retourne un tableau vide
    // TODO: Implémenter la query getJobsByCompanies dans le backend
    return of([]);
    
    /* Query à implémenter dans le backend:
    const query = `
      query GetEventCompanyJobs($companyIds: [ID!]!) {
        getJobsByCompanies(companyIds: $companyIds, filter: { status: "public" }) {
          id
          title
          description
          location
          salaryMin
          salaryMax
          status
          createdAt
          isFeatured
          isUrgent
          featuredImage {
            id
            fileUrl
          }
          jobType {
            id
            name
          }
          category {
            id
            name
          }
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
          }
        }
      }
    `;

    return this.http.post<any>(this.apiUrl, {
      query,
      variables: { companyIds: eventCompanyIds }
    }).pipe(
      map(response => response.data?.getJobsByCompanies || [])
    );
    */
  }

  /**
   * Match le profil avec les jobs des entreprises de l'événement
   */
  matchProfileWithEventJobs(
    profileData: any,
    eventCompanyIds: string[]
  ): Observable<any[]> {
    return this.getEventCompanyJobs(eventCompanyIds).pipe(
      map(jobs => {
        // Simple matching basé sur les compétences et intérêts
        return jobs.map(job => {
          const matchScore = this.calculateJobMatchScore(profileData, job);
          return {
            ...job,
            matchScore,
            matchPercentage: Math.round(matchScore * 100)
          };
        }).filter(job => job.matchScore > 0.3) // Garder seulement les jobs avec >30% de match
          .sort((a, b) => b.matchScore - a.matchScore); // Trier par score décroissant
      })
    );
  }

  /**
   * Calcule un score de matching simple entre un profil et un job
   */
  private calculateJobMatchScore(profile: any, job: any): number {
    let score = 0;
    let factors = 0;

    // Matching par compétences
    if (profile.skills && profile.skills.length > 0 && job.description) {
      const skillsMatch = profile.skills.some((skill: string) => 
        job.description.toLowerCase().includes(skill.toLowerCase()) ||
        job.title.toLowerCase().includes(skill.toLowerCase())
      );
      if (skillsMatch) {
        score += 0.4;
      }
      factors++;
    }

    // Matching par intérêts
    if (profile.interests && profile.interests.length > 0 && job.description) {
      const interestsMatch = profile.interests.some((interest: string) => 
        job.description.toLowerCase().includes(interest.toLowerCase()) ||
        job.title.toLowerCase().includes(interest.toLowerCase())
      );
      if (interestsMatch) {
        score += 0.3;
      }
      factors++;
    }

    // Matching par secteur
    if (profile.targetSectorIds && profile.targetSectorIds.length > 0 && job.category) {
      const sectorMatch = profile.targetSectorIds.includes(job.category.id);
      if (sectorMatch) {
        score += 0.3;
      }
      factors++;
    }

    // Normaliser le score
    return factors > 0 ? score / factors : 0;
  }
}
