import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { User } from 'src/app/shared/models/user.interface';
import { subscribeModal } from 'src/app/shared/utils/modal.utils';
import { SubSink } from 'subsink';
import { AuthenticationState } from '../../store/reducers/authentication.reducers';
import {
  getAccountActivationLoaded,
  getAccountActivationLoading,
  getLoggedUser,
} from '../../store/selectors/authentication.selectors';

@Component({
  selector: 'app-account-validation-form-root',
  templateUrl: './account-validation-form-root.component.html',
  styleUrls: ['./account-validation-form-root.component.scss'],
})
export class AccountValidationFormRootComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  loading: boolean;
  loaded: boolean;
  subs = new SubSink();
  checkIcon = faCircleCheck;
  user: User;
  @ViewChild('successfullSavingModal', { static: true })
  successfullSavingModal: ModalComponent;

  redirectUrl: string;

  private activatedRoute = inject(ActivatedRoute);

  constructor(private authenticationStore: Store<AuthenticationState>) {}

  ngOnInit() {
    this.loading$ = this.authenticationStore.pipe(
      select(getAccountActivationLoading)
    );
    this.loaded$ = this.authenticationStore.pipe(
      select(getAccountActivationLoaded)
    );
    this.subs.sink = this.loading$.subscribe((loading) => {
      this.loading = loading;
    });
    this.subs.sink = this.loaded$.subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.subs.sink = this.authenticationStore
      .pipe(select(getLoggedUser))
      .subscribe((user) => {
        this.user = user;
      });
    this.subscribeModals();
  }

  // signInByAccountValidation(message: string) {
  //     this.authenticationStore.dispatch(
  //         signInByAccountValidation()
  //     );
  // }

  onCloseSuccessfullSavingModal() {
    this.successfullSavingModal.close();
    this.authenticationStore.dispatch(
      this.redirectUrl
        ? go({ path: [`${this.redirectUrl}`] })
        : go({ path: ['/home'] })
    );
  }

  private subscribeModals() {
    subscribeModal(
      this.authenticationStore,
      getAccountActivationLoaded,
      true,
      this.successfullSavingModal
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
