import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AdvisorService } from '../../services/advisor.service';
import {
  loadAdvisorData,
  loadAdvisorDataFail,
  loadAdvisorDataSuccess,
} from '../actions/advisor.actions';
import { AdvisorState } from '../reducers/advisor.reducers';

@Injectable()
export class AdvisorEffects {
  constructor(
    private action$: Actions,
    private advisorService: AdvisorService
  ) {}

  loadAdvisorData$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadAdvisorData),
      switchMap(() =>
        this.advisorService.loadAdvisorData().pipe(
          map((response: Partial<AdvisorState>) =>
            loadAdvisorDataSuccess(response)
          ),
          catchError((error) => of(loadAdvisorDataFail(error)))
        )
      )
    )
  );
}
