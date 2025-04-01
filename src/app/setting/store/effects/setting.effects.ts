import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Setting } from 'src/app/shared/models/setting.interface';
import { SettingService } from '../../services/setting.service';
import {
  loadSetting,
  loadSettingFail,
  loadSettingSuccess,
  saveSetting,
  saveSettingFail,
  saveSettingSuccess,
} from '../actions/setting.actions';

@Injectable()
export class SettingEffects {
  constructor(
    private action$: Actions,
    private settingService: SettingService
  ) {}

  saveSetting$ = createEffect(() =>
    this.action$.pipe(
      ofType(saveSetting),
      switchMap((props: { payload: Setting }) =>
        this.settingService.saveSetting(props.payload).pipe(
          map((response: Setting) => saveSettingSuccess(response)),
          catchError((error) => of(saveSettingFail(error)))
        )
      )
    )
  );

  loadSetting$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadSetting),
      switchMap(() =>
        this.settingService.loadSetting().pipe(
          map((response: Setting) => loadSettingSuccess(response)),
          catchError((error) => of(loadSettingFail(error)))
        )
      )
    )
  );
}
