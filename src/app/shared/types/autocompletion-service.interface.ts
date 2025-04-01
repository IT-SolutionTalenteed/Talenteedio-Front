import { Observable } from 'rxjs';

export interface AutocompletionService<T, C> {
    items$: Observable<T[]>;
    loading$: Observable<boolean>;
    load: (criteria: C) => void;
    loadMore?: () => void;
}
