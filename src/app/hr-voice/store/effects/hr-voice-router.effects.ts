import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { filter, map } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import { HR_VOICE_ROUTE } from '../../constants/hr-voice.constants';
import { loadHrVoiceData } from '../actions/hr-voice.actions';

@Injectable()
export class HrVoiceRouterEffects {
  constructor(private action$: Actions) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  homeRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) => urlWithoutQueryParams === HR_VOICE_ROUTE
      ),
      map(() => loadHrVoiceData())
    )
  );
}
