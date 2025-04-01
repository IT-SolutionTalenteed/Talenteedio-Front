import { SortDirection } from 'src/app/shared/types/sort.interface';
import { InterviewFilter } from '../types/interview-filter.interface';
import { InterviewListCriteria } from '../types/interview-list-criteria.interface';

export const INTERVIEW_DEFAULT_CRITERIA: InterviewListCriteria = {
  filter: null,
  page: { page: 1, pageSize: 6 },
  sort: { by: 'id', direction: SortDirection.asc },
};

export const INTERVIEW_BASE_ROUTE = '/interview';
export const INTERVIEW_LIST_BASE_ROUTE = '/interview/list';
export const EMPTY_INTERVIEW_FILTER: InterviewFilter = {
  search: undefined,
};

export const INTERVIEW_DETAIL_ROUTE_REGEX = /\/interview\/\w+\/[\w+\d+]+/;
