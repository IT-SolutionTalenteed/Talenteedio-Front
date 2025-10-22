import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { environment } from 'src/environments/environment';
import { FreelanceListCriteria } from '../types/freelance-list-criteria.interface';

@Injectable()
export class FreelanceListService {
  constructor(private http: HttpClient) {}

  getFreelanceJobs(criteria: FreelanceListCriteria): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', criteria.page.page.toString());
    params = params.append('size', criteria.page.pageSize.toString());
    
    // Filtre spécifique pour les offres freelance
    params = params.append('isFreelance', 'true');

    if (criteria.filter.search) {
      params = params.append('search', criteria.filter.search);
    }
    if (criteria.filter.location) {
      params = params.append('locationId', criteria.filter.location.id);
    }
    if (criteria.filter.jobTypes && criteria.filter.jobTypes.length > 0) {
      criteria.filter.jobTypes.forEach((jobType) => {
        params = params.append('jobTypeIds', jobType.id);
      });
    }
    if (criteria.filter.datePosted) {
      params = params.append('datePosted', criteria.filter.datePosted);
    }
    if (criteria.filter.experienceLevels) {
      params = params.append(
        'experienceLevels',
        criteria.filter.experienceLevels
      );
    }
    if (criteria.filter.adminId) {
      params = params.append('adminId', criteria.filter.adminId);
    }
    if (criteria.filter.companyId) {
      params = params.append('companyId', criteria.filter.companyId);
    }
    if (criteria.filter.status) {
      params = params.append('status', criteria.filter.status);
    }
    if (criteria.filter.category) {
      params = params.append('category', criteria.filter.category);
    }
    if (criteria.filter.salaryMin) {
      params = params.append('salaryMin', criteria.filter.salaryMin.toString());
    }
    if (criteria.filter.salaryMax) {
      params = params.append('salaryMax', criteria.filter.salaryMax.toString());
    }
    if (criteria.filter.isFeatured) {
      params = params.append('isFeatured', criteria.filter.isFeatured.toString());
    }

    return this.http.get<any>(`${environment.apiBaseUrl}/jobs`, { params });
  }

  getJobTypes(): Observable<JobType[]> {
    return this.http.get<JobType[]>(`${environment.apiBaseUrl}/job-types`);
  }

  getJobCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/categories`);
  }

  getCompanies(): Observable<Company[]> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/companies/top`)
      .pipe(map((response) => response.data));
  }

  getDidYouKnow(): Observable<string> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/did-you-know/random`)
      .pipe(map((response) => response?.data?.content || null));
  }
}
