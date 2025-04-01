import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HrVoiceService } from '../../services/hr-voice.service';
import {
  loadHrVoiceData,
  loadHrVoiceDataFail,
  loadHrVoiceDataSuccess,
} from '../actions/hr-voice.actions';
import { HrVoiceState } from '../reducers/hr-voice.reducers';

@Injectable()
export class HrVoiceEffects {
  constructor(
    private action$: Actions,
    private hrVoiceService: HrVoiceService
  ) {}

  loadHrVoiceData$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadHrVoiceData),
      switchMap(() =>
        this.hrVoiceService.loadHrVoiceData().pipe(
          map((response: Partial<HrVoiceState>) =>
            loadHrVoiceDataSuccess(response)
          ),
          catchError((error) => of(loadHrVoiceDataFail(error)))
        )
      )
    )
  );
}
