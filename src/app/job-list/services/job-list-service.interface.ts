import { Observable } from 'rxjs';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { JobListCriteria } from '../types/job-list-criteria.interface';
import { Job } from './../../shared/models/job.interface';

export interface JobListServiceInterface {
  loadJobs(criteria: JobListCriteria): Observable<Paginated<Job>>;
  jobFactory(): Observable<Job>;
}
