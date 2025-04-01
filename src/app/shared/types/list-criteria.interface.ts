import { Page } from './page.interface';
import { Sort } from './sort.interface';

export interface ListCriteria {
    page: Page;
    search: string;
    sort: Sort;
}
