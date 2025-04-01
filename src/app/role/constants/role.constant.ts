import { Role } from 'src/app/shared/models/role.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';

export const ROLE_DEFAULT_CRITERIA: ListCriteria = {
    page: { page: 1, pageSize: 15 },
    sort: { by: 'name', direction: SortDirection.asc },
    search: '',
};

export const EMPTY_ROLE: Role = {
    id: undefined,
    name: null,
    // privileges: [],
    title: '',
};

export const ROLE_ROUTE = 'role';

export const ROLE_BASE_ROUTE = '/param/access/role';

export const ROLE_DETAIL_ROUTE_REGEX = /\/\w+\/\w+\/\w+\/role\/\w+\/[\w+\d+]+/;
