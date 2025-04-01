import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { showSuccess } from 'src/app/routeur/store/actions/router.actions';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import { EmailService } from '../../services/email.service';
import { ContactEmail } from '../../types/contact-email.interface';
import { sendEmail, sendEmailFail, sendEmailSuccess } from '../actions/contact.actions';


@Injectable()
export class ContactEffects {
  constructor(
    private action$: Actions,
    private emailService: EmailService,
    private routerStore: Store<AppRouterState>
  ) {}

  sendMail$ = createEffect(() =>
    this.action$.pipe(
      ofType(sendEmail),
      switchMap((props: ContactEmail & {to: string}) =>
        this.emailService.sendEmail(props).pipe(
          mergeMap((response) => [showSuccess({message: response.sendMail}),sendEmailSuccess()]),
          catchError((error) => of(sendEmailFail(error)))
        )
      )
    )
  );
}
