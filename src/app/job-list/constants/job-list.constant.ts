import { SortDirection } from 'src/app/shared/types/sort.interface';
import { JobListCriteria } from '../types/job-list-criteria.interface';
import { JobFilter } from './../types/job-filter.interface';

export const EMPTY_JOB_FILTER: JobFilter = {
  search: undefined,
  location: null,
  jobTypes: [],
  datePosted: undefined,
  experienceLevels: null,
  adminId: '',
  companyId: '',
  status: '',
  category: null,
  salaryMin: 0,
  salaryMax: 0,
  isFeatured: undefined,
};

export const JOB_LIST_DEFAULT_CRITERIA: JobListCriteria = {
  page: { page: 1, pageSize: 6 },
  sort: { by: 'name', direction: SortDirection.asc },
  filter: null,
};

export const DATE_POSTED_FILTER = [
  'All',
  'Last hour',
  'Last 24 hours',
  'Last 7 days',
  'Last 14 days',
  'Last 30 days',
];

export const DATE_POSTED_TRANSLATION = {
  ['All']: undefined,
  ['Last hour']: 1,
  ['Last 24 hours']: 24,
  ['Last 7 days']: 168,
  ['Last 14 days']: 336,
  ['Last 30 days']: 720,
};

export const EXPERIENCE_LEVEL_FILTER = [
  '',
  'Fresh',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
];

export const EXPERIENCE_LEVEL_FILTER_TRANSLATION = {
  ['Fresh']: 0,
  ['1 Year']: 1,
  ['2 Years']: 2,
  ['3 Years']: 3,
  ['4 Years']: 4,
  ['5 Years']: 5,
};

export const JOB_LIST_BASE_ROUTE = '/job/list';
