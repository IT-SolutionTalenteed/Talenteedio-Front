export interface FilterItem {
    name: string;
    count: number;
    selected?: boolean;
}

export type FilterUpdates = Record<string, FilterItem[]>;

export type ListBoxFilter = Record<string, string[] | null>;
