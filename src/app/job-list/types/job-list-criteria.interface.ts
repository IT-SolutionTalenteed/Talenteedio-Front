import { Page } from 'src/app/shared/types/page.interface';
import { Sort } from 'src/app/shared/types/sort.interface';
import { JobFilter } from './job-filter.interface';

export interface JobListCriteria {
    page: Page | null;
    sort: Sort;
    filter: JobFilter | null;
}
