import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { filter, map } from 'rxjs';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import { SETTING_FORM_ROUTE_REGEX } from '../../constants/setting.constant';
import { loadSetting } from '../actions/setting.actions';

@Injectable()
export class SettingRouterEffects {
  constructor(private action$: Actions) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  settingRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(({ urlWithoutQueryParams }) =>
        SETTING_FORM_ROUTE_REGEX.test(urlWithoutQueryParams)
      ),
      map(() => loadSetting())
    )
  );
}
