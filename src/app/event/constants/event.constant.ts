import { SortDirection } from 'src/app/shared/types/sort.interface';
import { EventFilter } from '../types/event-filter.interface';
import { EventListCriteria } from '../types/event-list-criteria.interface';

export const EMPTY_EVENT_FILTER: EventFilter = {
  search: undefined,
};

export const EVENT_DEFAULT_CRITERIA: EventListCriteria = {
  sort: { by: 'id', direction: SortDirection.asc },
  page: { page: 1, pageSize: 6 },
  filter: null,
};

export const EVENT_LIST_BASE_ROUTE = '/event/list';

export const EVENT_BASE_ROUTE = '/event';

export const EVENT_DETAIL_ROUTE_REGEX = /\/event\/detail\/[\w-]+/;
