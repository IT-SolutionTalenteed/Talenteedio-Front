import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { showSuccess } from 'src/app/routeur/store/actions/router.actions';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import { JoinUsService } from '../../services/join-us.service';
import { JoinUsForm } from '../../types/join-us-form.interface';
import {
  sendEmail,
  sendEmailFail,
  sendEmailSuccess,
} from '../actions/join-us.actions';

@Injectable()
export class JoinUsEffects {
  constructor(
    private action$: Actions,
    private joinUsService: JoinUsService,
    private routerStore: Store<AppRouterState>
  ) {}

  sendMail$ = createEffect(() =>
    this.action$.pipe(
      ofType(sendEmail),
      switchMap((props: JoinUsForm & { recaptcha: string }) =>
        this.joinUsService.send(props).pipe(
          mergeMap((response) => [
            showSuccess({ message: response.joinUs }),
            sendEmailSuccess(),
          ]),
          catchError((error) => of(sendEmailFail(error)))
        )
      )
    )
  );
}
