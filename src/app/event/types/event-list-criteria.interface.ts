import { Page } from 'src/app/shared/types/page.interface';
import { Sort } from 'src/app/shared/types/sort.interface';
import { EventFilter } from './event-filter.interface';

export interface EventListCriteria {
  filter: EventFilter | null;
  page: Page | null;
  sort: Sort;
}
