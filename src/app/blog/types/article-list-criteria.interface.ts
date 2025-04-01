import { Page } from 'src/app/shared/types/page.interface';
import { Sort } from 'src/app/shared/types/sort.interface';
import { ArticleFilter } from './article-filter.interface';

export interface ArticleListCriteria {
  filter: ArticleFilter | null;
  page: Page | null;
  sort: Sort;
}
