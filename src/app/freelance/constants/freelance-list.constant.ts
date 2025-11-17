import { FreelanceFilter } from '../types/freelance-filter.interface';

export const EMPTY_FREELANCE_FILTER: FreelanceFilter = {
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

export const EXPERIENCE_LEVEL_FILTER = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'SENIOR', label: 'Senior' },
];

export const DATE_POSTED_FILTER = [
  { value: 'ALL', label: 'All' },
  { value: 'LAST_HOUR', label: 'Last hour' },
  { value: 'LAST_24_HOURS', label: 'Last 24 hours' },
  { value: 'LAST_7_DAYS', label: 'Last 7 days' },
  { value: 'LAST_14_DAYS', label: 'Last 14 days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 days' },
];
