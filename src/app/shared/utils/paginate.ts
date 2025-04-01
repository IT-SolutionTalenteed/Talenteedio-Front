import { Page } from '../types/page.interface';

export const paginate = <T>(items: T[], page: Page): T[] => {
    const start = page.pageSize * (page.page - 1);
    const end = start + page.pageSize;
    return items.slice(start, end);
};
