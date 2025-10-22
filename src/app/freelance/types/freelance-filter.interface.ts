import { JobType } from 'src/app/shared/models/job.interface';
import { LocationJob } from 'src/app/shared/models/location-job.interface';

export interface FreelanceFilter {
  search: string;
  location: LocationJob;
  jobTypes: JobType[];
  datePosted: string;
  experienceLevels: string;
  adminId: string;
  companyId: string;
  status: string;
  category: string;
  salaryMin: number;
  salaryMax: number;
  isFeatured: boolean;
}
