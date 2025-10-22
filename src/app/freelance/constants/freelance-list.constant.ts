import { FreelanceFilter } from '../types/freelance-filter.interface';

export const EMPTY_FREELANCE_FILTER: FreelanceFilter = {
  search: '',
  location: null,
  jobTypes: [],
  datePosted: '',
  experienceLevels: '',
  adminId: '',
  companyId: '',
  status: '',
  category: '',
  salaryMin: null,
  salaryMax: null,
  isFeatured: false,
};

export const EXPERIENCE_LEVEL_FILTER = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'SENIOR', label: 'Senior' },
];

export const DATE_POSTED_FILTER = [
  { value: 'ALL', label: 'All' },
  { value: 'LAST_24_HOURS', label: 'Last 24 hours' },
  { value: 'LAST_7_DAYS', label: 'Last 7 days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 days' },
];
