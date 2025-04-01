import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';

export const USER_DEFAULT_CRITERIA: ListCriteria = {
  page: { page: 1, pageSize: 15 },
  sort: { by: 'name', direction: SortDirection.asc },
  search: '',
};

export const EMPTY_USER: User = {
  id: undefined,
  email: '',
  role: undefined,
  values: [],
  cvId: undefined,
  validateAt: undefined,
  articles: [],
  roles: [],
  isVerified: false,
  phone: undefined,
};

export const USER_ROUTE = 'user';

export const USER_BASE_ROUTE = '/param/access/user';

export const USER_DETAIL_ROUTE_REGEX = /\/\w+\/\w+\/\w+\/user\/\w+\/[\w+\d+]+/;
