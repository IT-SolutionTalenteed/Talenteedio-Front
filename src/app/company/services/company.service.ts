import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, switchMap, catchError, throwError, of } from 'rxjs';
import { Company } from 'src/app/shared/models/company.interface';
import { environment } from 'src/environments/environment';

const GET_COMPANIES = gql`
  query GetCompanies($input: PaginationInput, $filter: CompanyFilter) {
    getCompanies(input: $input, filter: $filter) {
      rows {
        id
        company_name
        logo {
          fileUrl
        }
        contact {
          address {
            line
            city
            country
          }
        }
        category {
          id
          name
          slug
        }
      }
      total
    }
  }
`;

const GET_COMPANY = gql`
  query GetCompany($id: String!) {
    getOneCompany(input: { id: $id }) {
      id
      company_name
      logo {
        fileUrl
      }
      contact {
        email
        phoneNumber
        address {
          line
          city
          postalCode
          country
        }
      }
      category {
        id
        name
      }
      jobs {
        id
        title
      }
    }
  }
`;

const GET_COMPANY_EVENTS = gql`
  query GetCompanyEvents {
    getEvents(input: { limit: 100, page: 1 }, filter: { status: "public" }) {
      rows {
        id
        title
        slug
        metaDescription
        date
        startTime
        endTime
        location
        image
        companies {
          id
          company_name
          logo {
            fileUrl
          }
        }
        createdAt
      }
      total
    }
  }
`;

const GET_COMPANY_ARTICLES = gql`
  query GetCompanyArticles($companyId: String!) {
    getArticles(input: { limit: 3, page: 1 }, filter: { companyId: $companyId, status: "public" }) {
      rows {
        id
        title
        slug
        publicContent
        metaDescription
        image {
          fileUrl
        }
        createdAt
        admin {
          user {
            firstname
            lastname
          }
        }
      }
      total
    }
  }
`;

const GET_COMPANY_JOBS = gql`
  query GetCompanyJobs($companyId: String!) {
    getJobs(input: { limit: 3, page: 1 }, filter: { companyId: $companyId, status: "public" }) {
      rows {
        id
        title
        slug
        content
        featuredImage {
          fileUrl
        }
        location {
          name
          address {
            city
            country
          }
        }
        jobType {
          name
        }
        createdAt
      }
      total
    }
  }
`;

const GET_COMPANY_FREELANCE_JOBS = gql`
  query GetCompanyFreelanceJobs($companyId: String!) {
    getFreelanceJobs(input: { limit: 3, page: 1 }, filter: { companyId: $companyId }) {
      rows {
        id
        title
        slug
        salaryMin
        salaryMax
        featuredImage {
          fileUrl
        }
        location {
          name
          address {
            city
            country
          }
        }
        jobType {
          name
        }
        createdAt
      }
      total
    }
  }
`;

@Injectable()
export class CompanyService {
  private userApiUrl = `${environment.apiBaseUrl}/user`;
  private eventApiUrl = `${environment.apiBaseUrl}/event`;
  private articleApiUrl = `${environment.apiBaseUrl}/article`;
  private jobApiUrl = `${environment.apiBaseUrl}/job`;
  private jobFreelanceApiUrl = `${environment.apiBaseUrl}/jobfreelance`;

  constructor(private apollo: Apollo) {}

  /**
   * Décode les entités HTML
   */
  private decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  /**
   * Génère un slug à partir du nom de l'entreprise et de l'ID
   */
  private generateSlug(companyName: string, id: string): string {
    // Décoder les entités HTML d'abord (&#38; -> &, etc.)
    const decodedName = this.decodeHtmlEntities(companyName);
    
    const slug = decodedName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Retire les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères spéciaux par des tirets
      .replace(/^-+|-+$/g, ''); // Retire les tirets au début et à la fin
    
    // Prend les 8 premiers caractères de l'ID pour garder l'unicité
    const shortId = id.substring(0, 8);
    return `${slug}-${shortId}`;
  }

  /**
   * Extrait l'ID court d'un slug (les 8 derniers caractères après le dernier tiret)
   */
  private extractShortIdFromSlug(slug: string): string {
    const parts = slug.split('-');
    const shortId = parts[parts.length - 1];
    console.log('Extracting shortId from slug:', slug, '-> shortId:', shortId);
    return shortId;
  }

  /**
   * Charge la liste des entreprises sans générer les slugs (pour éviter la récursion)
   */
  private loadCompaniesRaw(): Observable<Company[]> {
    const props = {
      input: {
        limit: 100,
        page: 1,
      },
      filter: {
        status: 'public',
      },
    };

    return this.apollo
      .query<{ getCompanies: { rows: Company[]; total: number } }>({
        query: GET_COMPANIES,
        variables: props,
        fetchPolicy: 'network-only',
        context: {
          uri: this.userApiUrl,
        },
      })
      .pipe(
        map((response) => response.data.getCompanies.rows)
      );
  }

  /**
   * Trouve l'ID complet d'une entreprise à partir de son slug
   */
  private findCompanyIdBySlug(slug: string): Observable<string> {
    const shortId = this.extractShortIdFromSlug(slug);
    console.log('Extracted shortId from slug:', shortId);
    
    return this.loadCompaniesRaw().pipe(
      map(companies => {
        console.log('Loaded companies count:', companies.length);
        console.log('Looking for company with ID starting with:', shortId);
        
        const company = companies.find(c => {
          const matches = c.id && c.id.startsWith(shortId);
          if (matches) {
            console.log('Found matching company:', c.company_name, c.id);
          }
          return matches;
        });
        
        if (!company) {
          console.error('No company found for shortId:', shortId);
          console.log('Available IDs:', companies.map(c => c.id));
          throw new Error(`Company not found for slug: ${slug} (shortId: ${shortId})`);
        }
        return company.id;
      })
    );
  }

  loadCompanies(): Observable<Company[]> {
    const props = {
      input: {
        limit: 100,
        page: 1,
      },
      filter: {
        status: 'public',
      },
    };

    return this.apollo
      .query<{ getCompanies: { rows: Company[]; total: number } }>({
        query: GET_COMPANIES,
        variables: props,
        fetchPolicy: 'network-only',
        context: {
          uri: this.userApiUrl,
        },
      })
      .pipe(
        map((response) => {
          // Ajoute le slug à chaque entreprise
          return response.data.getCompanies.rows.map(company => ({
            ...company,
            slug: this.generateSlug(company.company_name, company.id)
          }));
        })
      );
  }

  loadCompany(slugOrId: string): Observable<Company> {
    console.log('loadCompany called with:', slugOrId);
    
    // Si c'est un UUID complet, on l'utilise directement
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    
    console.log('Is UUID?', isUUID);
    
    if (isUUID) {
      console.log('Loading company by UUID:', slugOrId);
      return this.apollo
        .query<{ getOneCompany: Company }>({
          query: GET_COMPANY,
          variables: { id: slugOrId },
          fetchPolicy: 'network-only',
          context: {
            uri: this.userApiUrl,
          },
        })
        .pipe(
          map((response) => {
            console.log('UUID query response:', response);
            const company = response.data.getOneCompany;
            return {
              ...company,
              slug: this.generateSlug(company.company_name, company.id)
            };
          }),
          catchError(error => {
            console.error('Error in UUID query:', error);
            return throwError(() => error);
          })
        );
    }
    
    // Sinon, c'est un slug, on doit trouver l'ID complet
    console.log('Resolving slug to ID...');
    return this.findCompanyIdBySlug(slugOrId).pipe(
      catchError(error => {
        console.error('Error finding company ID by slug:', error);
        return throwError(() => error);
      }),
      switchMap(id => {
        console.log('Found ID:', id, '- Now fetching company details...');
        return this.apollo
          .query<{ getOneCompany: Company }>({
            query: GET_COMPANY,
            variables: { id },
            fetchPolicy: 'network-only',
            context: {
              uri: this.userApiUrl,
            },
          })
          .pipe(
            map((response) => {
              console.log('GraphQL response received:', response);
              const company = response.data.getOneCompany;
              console.log('Company data:', company);
              return {
                ...company,
                slug: this.generateSlug(company.company_name, company.id)
              };
            }),
            catchError(error => {
              console.error('Error in GraphQL query:', error);
              return throwError(() => error);
            })
          );
      })
    );
  }

  loadCompanyEvents(companyId: string): Observable<any[]> {
    return this.apollo
      .query<{ getEvents: { rows: any[]; total: number } }>({
        query: GET_COMPANY_EVENTS,
        fetchPolicy: 'network-only',
        context: {
          uri: this.eventApiUrl,
        },
      })
      .pipe(
        map((response) => {
          // Filtrer les événements qui incluent cette entreprise
          const events = response.data.getEvents.rows.filter(event => 
            event.companies && event.companies.some(company => company.id === companyId)
          );
          // Limiter à 3 événements
          return events.slice(0, 3);
        }),
        catchError(() => of([]))
      );
  }

  loadCompanyArticles(companyId: string): Observable<any[]> {
    return this.apollo
      .query<{ getArticles: { rows: any[]; total: number } }>({
        query: GET_COMPANY_ARTICLES,
        variables: { companyId },
        fetchPolicy: 'network-only',
        context: {
          uri: this.articleApiUrl,
        },
      })
      .pipe(
        map((response) => response.data.getArticles.rows),
        catchError(() => of([]))
      );
  }

  loadCompanyJobs(companyId: string): Observable<any[]> {
    console.log('[DEBUG] loadCompanyJobs called with companyId:', companyId);
    return this.apollo
      .query<{ getJobs: { rows: any[]; total: number } }>({
        query: GET_COMPANY_JOBS,
        variables: { companyId },
        fetchPolicy: 'network-only',
        context: {
          uri: this.jobApiUrl,
        },
      })
      .pipe(
        map((response) => {
          console.log('[DEBUG] loadCompanyJobs response:', response.data.getJobs);
          return response.data.getJobs.rows;
        }),
        catchError(() => of([]))
      );
  }

  loadCompanyFreelanceJobs(companyId: string): Observable<any[]> {
    console.log('[DEBUG] loadCompanyFreelanceJobs called with companyId:', companyId);
    return this.apollo
      .query<{ getFreelanceJobs: { rows: any[]; total: number } }>({
        query: GET_COMPANY_FREELANCE_JOBS,
        variables: { companyId },
        fetchPolicy: 'network-only',
        context: {
          uri: this.jobFreelanceApiUrl,
        },
      })
      .pipe(
        map((response) => {
          console.log('[DEBUG] loadCompanyFreelanceJobs response:', response.data.getFreelanceJobs);
          return response.data.getFreelanceJobs.rows;
        }),
        catchError(() => of([]))
      );
  }
}
