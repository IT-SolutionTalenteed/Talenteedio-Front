import { Image } from '../types/image.interface';
import { LocationJob } from './location-job.interface';
import { Skill } from './skill.interface';
import { Status } from './status.enum';
import { User } from './user.interface';
import { Company } from './company.interface';

export enum HourType {
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  BOTH = 'Both',
}

export enum SalaryType {
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export interface JobType {
  id: string;
  name: string;
  status: Status;
}
export interface Job {
  id: string;
  title: string;
  content: string;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  hours: number;
  hourType: HourType;
  gender: Gender;
  salaryMin: number;
  salaryMax: number;
  salaryType: SalaryType;
  experience: number;
  recruitmentNumber: number;
  status: Status;
  location: LocationJob;
  isFeatured: boolean;
  isUrgent: boolean;
  isSharable: boolean;
  featuredImage: Image;
  jobType: JobType;
  category: Category;
  skills: Skill[];
  user: string | User;
  company?: Company;
  referralLink?: string;
  hasApplied: boolean;
  slug: string;
  metaDescription: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  status: Status;
  model: Model;
}

export enum Model {
  JOB = 'Job',
  TALENT = 'Talent',
  COMPANY = 'Company',
  JOB_TALENT = 'Job_Talent',
  ARTICLE = 'Article',
  REFERRAL = 'Referral',
}
