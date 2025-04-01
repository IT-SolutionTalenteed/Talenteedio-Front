export enum SortDirection {
    asc = 'asc',
    desc = 'desc'
}

export interface Sort {
    by: string;
    direction: SortDirection;
}
