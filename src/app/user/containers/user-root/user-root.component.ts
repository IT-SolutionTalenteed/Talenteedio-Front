import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { User } from 'src/app/shared/models/user.interface';
import { ListCriteria } from 'src/app/shared/types/list-criteria.interface';
import { Page } from 'src/app/shared/types/page.interface';
import { Sort } from 'src/app/shared/types/sort.interface';
import { subscribeModal } from 'src/app/shared/utils/modal.utils';
import { USER_BASE_ROUTE } from '../../constants/user.constant';
import { deleteUser, loadUsers } from '../../store/actions/user.actions';
import { UserState } from '../../store/reducers/user.reducers';
import {
  getIsEditingOrDetail,
  getUser,
  getUserCriteria,
  getUserSaved,
  getUsers,
  getUsersLoading,
  getUsersTotalItems,
} from '../../store/selectors/user.selectors';

@Component({
  selector: 'app-user-root',
  templateUrl: './user-root.component.html',
  styleUrls: ['./user-root.component.scss'],
})
export class UserRootComponent implements OnInit {
  users$: Observable<User[]>;
  usersLoading$: Observable<boolean>;
  userEditEnabled$: Observable<boolean>;
  userDeleteEnabled$: Observable<boolean>;
  isEditingOrDetail$: Observable<boolean>;
  userCreateEnabled$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentUser$: Observable<User>;
  userCriteria: ListCriteria;
  toBeDeletedUser: User;


  @ViewChild('deletionConfirmModal', { static: true })
  deletionConfirmModal: ModalComponent;
  @ViewChild('successfullSavingModal', { static: true })
  successfullSavingModal: ModalComponent;

  constructor(
    private userStore: Store<UserState>,
    private authenticationStore: Store<AuthenticationState>
  ) {}

  ngOnInit() {
    this.users$ = this.userStore.pipe(select(getUsers));
    this.usersLoading$ = this.userStore.pipe(select(getUsersLoading));
    this.totalItems$ = this.userStore.pipe(select(getUsersTotalItems));
    this.currentUser$ = this.userStore.pipe(select(getUser));
    this.isEditingOrDetail$ = this.userStore.pipe(select(getIsEditingOrDetail));
    this.userStore
      .pipe(select(getUserCriteria))
      .subscribe((criteria) => (this.userCriteria = cloneDeep(criteria)));
    this.subscribeModals();
  }



  onSort(sort: Sort) {
    this.userCriteria.sort = sort;
    this.userStore.dispatch(loadUsers({ ...this.userCriteria }));
  }

  onSearch(search: string) {
    this.userCriteria.search = search;
    this.userStore.dispatch(
      loadUsers({
        ...this.userCriteria,
        page: { ...this.userCriteria.page, page: 1 },
      })
    );
  }

  onViewDetail(user: User) {
    this.go([`${USER_BASE_ROUTE}/detail`, user.id]);
  }

  onEdit(user: User) {
    this.go([`${USER_BASE_ROUTE}/edit`, user.id]);
  }

  onDelete(user: User) {
    this.toBeDeletedUser = user;
    this.deletionConfirmModal.open();
  }

  onPaginate(page: Page) {
    this.userCriteria.page = page;
    this.userStore.dispatch(loadUsers({ ...this.userCriteria }));
  }

  onCreate() {
    this.go([`${USER_BASE_ROUTE}/new`]);
  }

  onConfirmDeletion() {
    this.userStore.dispatch(deleteUser(this.toBeDeletedUser));
  }

  private subscribeModals() {
    subscribeModal(
      this.userStore,
      getUserSaved,
      true,
      this.successfullSavingModal
    );
  }

  private go(path: string[]) {
    this.userStore.dispatch(go({ path }));
  }
}
