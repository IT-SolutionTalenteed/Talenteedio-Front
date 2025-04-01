import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { User } from 'src/app/shared/models/user.interface';
import { Value } from 'src/app/shared/models/value.interface';
import { subscribeModal } from 'src/app/shared/utils/modal.utils';
import { SubSink } from 'subsink';
import { AuthenticationService } from '../../services/authentication.service';
import { signupUser } from '../../store/actions/authentication.actions';
import { AuthenticationState } from '../../store/reducers/authentication.reducers';
import {
  getSignUpError,
  getUserSaved,
  getUserSaving,
  getValues,
} from '../../store/selectors/authentication.selectors';

@Component({
  selector: 'app-sign-up-root',
  templateUrl: './sign-up-root.component.html',
  styleUrls: ['./sign-up-root.component.scss'],
})
export class SignUpRootComponent implements OnInit, OnDestroy {
  userSaving$: Observable<boolean>;
  signupError$: Observable<Error>;
  loading$: Observable<boolean>;
  values$ = new Observable<Value[]>();
  @ViewChild('successfullSavingModal', { static: true })
  successfullSavingModal: ModalComponent;

  checkIcon = faCircleCheck;

  redirectUrl: string;
  subs = new SubSink();

  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private authenticationStore: Store<AuthenticationState>,
    private autheticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.userSaving$ = this.authenticationStore.pipe(select(getUserSaving));
    this.signupError$ = this.authenticationStore.pipe(select(getSignUpError));
    this.values$ = this.authenticationStore.pipe(select(getValues));
    // this.loading$ = this.authenticationStore.select(getAuthenticationLoading);
    this.subscribeModals();
    this.subs.sink = this.activatedRoute.params.subscribe((params) => {
      this.redirectUrl = params['redirect'];
    });
  }

  onSave(user: User) {
    this.authenticationStore.dispatch(signupUser({ payload: user }));
  }
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
      getUserSaved,
      true,
      this.successfullSavingModal
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
