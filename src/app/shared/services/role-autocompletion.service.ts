import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Role } from 'src/app/shared/models/role.interface';
import { AUTOCOMPLETION_DEFAULT_PAGE } from '../constants/autocompletion.constant';
import {
  loadMoreRolesForAutocompletion,
  loadRolesForAutocompletion
} from '../store/actions/shared.actions';
import { SharedState } from '../store/reducers/shared.reducers';
import {
  getAutocompletionLoading,
  getAutocompletionRoles
} from '../store/selectors/shared.selectors';
import { AutocompletionService } from '../types/autocompletion-service.interface';
import { ListCriteria } from '../types/list-criteria.interface';

@Injectable()
export class RoleAutocompletionService implements AutocompletionService<Role, ListCriteria> {
    items$ = this.sharedStore.pipe(select(getAutocompletionRoles));
    loading$ = this.sharedStore.pipe(select(getAutocompletionLoading));

    private criteria: ListCriteria;

    constructor(private sharedStore: Store<SharedState>) {}

    load = criteria => {
        this.criteria = { ...criteria, page: cloneDeep(AUTOCOMPLETION_DEFAULT_PAGE) };
        this.sharedStore.dispatch(loadRolesForAutocompletion(cloneDeep(this.criteria)));
    };

    loadMore = () => {
        this.criteria = {
            ...this.criteria,
            page: {
                page: this.criteria.page.page + 1,
                pageSize: this.criteria.page.pageSize
            }
        };
        this.sharedStore.dispatch(loadMoreRolesForAutocompletion(cloneDeep(this.criteria)));
    };
}
