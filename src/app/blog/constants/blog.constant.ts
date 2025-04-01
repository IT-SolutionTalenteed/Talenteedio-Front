import { SortDirection } from 'src/app/shared/types/sort.interface';
import { ArticleFilter } from '../types/article-filter.interface';
import { ArticleListCriteria } from '../types/article-list-criteria.interface';

export const EMPTY_BLOG_FILTER: ArticleFilter = {
  search: undefined,
};

export const BLOG_DEFAULT_CRITERIA: ArticleListCriteria = {
  sort: { by: 'id', direction: SortDirection.asc },
  page: { page: 1, pageSize: 6 },
  filter: null,
};

export const BLOG_LIST_BASE_ROUTE = '/blog/list';

export const BLOG_BASE_ROUTE = '/blog';

export const BLOG_DETAIL_ROUTE_REGEX = /\/blog\/\w+\/[\w+\d+]+/;
