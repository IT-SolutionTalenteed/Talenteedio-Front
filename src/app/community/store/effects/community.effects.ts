import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getUserRole } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Setting } from 'src/app/shared/models/setting.interface';
import { SettingService } from 'src/app/shared/services/setting.service';
import { CommunityService } from '../../services/community.service';
import {
  loadCommunityData,
  loadCommunityDataFail,
  loadCommunityDataSuccess,
  loadHomeSetting,
  loadHomeSettingFail,
  loadHomeSettingSuccess,
} from '../actions/community.actions';
import { CommunityState } from '../reducers/community.reducers';

@Injectable()
export class CommunityEffects {
  private settingService = inject(SettingService);
  constructor(
    private communityService: CommunityService,
    private action$: Actions,
    private store: Store<AuthenticationState>
  ) {}

  loadCommunityData$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadCommunityData),
      withLatestFrom(this.store.select(getUserRole)),
      switchMap(([action, userRole]) =>
        this.communityService.loadCommunityData(userRole).pipe(
          map((response: Partial<CommunityState>) =>
            loadCommunityDataSuccess(response)
          ),
          catchError((error) => of(loadCommunityDataFail(error)))
        )
      )
    )
  );

  loadHomeSetting$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadHomeSetting),
      switchMap(() =>
        this.settingService.loadSetting().pipe(
          map((response: Setting) => loadHomeSettingSuccess(response)),
          catchError((error) => of(loadHomeSettingFail(error)))
        )
      )
    )
  );
}
