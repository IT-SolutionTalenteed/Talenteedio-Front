import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { Setting } from 'src/app/shared/models/setting.interface';
import { SettingService } from 'src/app/shared/services/setting.service';
import {
  loadTerms,
  loadTermsFail,
  loadTermsSuccess,
} from '../actions/terms-and-conditions.actions';
import { TermsAndConditionsState } from '../reducers/terms-and-conditions.reducers';

@Injectable()
export class TermsAndConditionsEffects {
  constructor(
    private action$: Actions,
    private settingService: SettingService,
    private store: Store<TermsAndConditionsState>
  ) {}

  loadTerms$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadTerms),
      switchMap(() =>
        this.settingService.loadSetting().pipe(
          map((response: Setting) =>
            loadTermsSuccess({ terms: response.terms })
          ),
          catchError((error) => of(loadTermsFail(error)))
        )
      )
    )
  );
}
