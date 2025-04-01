import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { loadArticleFail } from 'src/app/blog/store/actions/blog.actions';
import { Setting } from 'src/app/shared/models/setting.interface';
import { SettingService } from 'src/app/shared/services/setting.service';
import {
  loadPrivacy,
  loadPrivacySuccess,
} from '../actions/privacy-policy.actions';
import { PrivacyPolicyState } from '../reducers/privacy-policy.reducers';

@Injectable()
export class PrivacyPolicyEffects {
  constructor(
    private action$: Actions,
    private settingService: SettingService,
    private store: Store<PrivacyPolicyState>
  ) {}

  loadPrivacy$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadPrivacy),
      switchMap(() =>
        this.settingService.loadSetting().pipe(
          map((response: Setting) =>
            loadPrivacySuccess({ privacy: response.confidentiality })
          ),
          catchError((error) => of(loadArticleFail(error)))
        )
      )
    )
  );
}
