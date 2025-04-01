import { Job } from 'src/app/shared/models/job.interface';

export interface JobReferCriteria {
  job: Job;
  talentEmail: string;
  talentFullName: string;
  jobReferenceLink: string;
  talentNumber?: string;
}
