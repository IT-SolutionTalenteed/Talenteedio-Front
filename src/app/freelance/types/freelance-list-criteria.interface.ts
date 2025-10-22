import { Page } from 'src/app/shared/types/page.interface';
import { FreelanceFilter } from './freelance-filter.interface';

export interface FreelanceListCriteria {
  filter: FreelanceFilter;
  page: Page;
}
