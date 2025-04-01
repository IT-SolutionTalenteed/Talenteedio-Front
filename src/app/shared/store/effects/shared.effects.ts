import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RoleService } from 'src/app/role/services/role.service';
import { Role } from 'src/app/shared/models/role.interface';

import { Ad } from '../../models/ad.interface';
import { Contact } from '../../models/contact.interface';
import { LocationJob } from '../../models/location-job.interface';
import { Setting } from '../../models/setting.interface';
import { AdService } from '../../services/ad.service';
import { LocationService } from '../../services/location.service';
import { SettingService } from '../../services/setting.service';
import { ListCriteria } from '../../types/list-criteria.interface';
import { Paginated } from '../../types/paginated.interface';
import {
  loadAd,
  loadAdFail,
  loadAdSuccess,
  loadForAutocompletionFail,
  loadLocation,
  loadLocationFail,
  loadLocationSuccess,
  loadLocations,
  loadLocationsFail,
  loadLocationsSuccess,
  loadMoreRolesForAutocompletion,
  loadMoreRolesForAutocompletionSuccess,
  loadRolesForAutocompletion,
  loadRolesForAutocompletionSuccess,
} from '../actions/shared.actions';

@Injectable()
export class SharedEffects {
  // eslint-disable-next-line max-params
  constructor(
    private action$: Actions,
    private roleService: RoleService,
    private locationService: LocationService,
    private settingService: SettingService,
    private adService: AdService
  ) {}

  loadRolesForAutocompletion$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadRolesForAutocompletion),
      switchMap((props: ListCriteria) =>
        this.roleService.loadRoles(props).pipe(
          map((response: Paginated<Role>) =>
            loadRolesForAutocompletionSuccess({ roles: response.items })
          ),
          catchError((error) => of(loadForAutocompletionFail(error)))
        )
      )
    )
  );

  loadMoreMoreRolesForAutocompletion$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadMoreRolesForAutocompletion),
      switchMap((props) =>
        this.roleService.loadRoles(props).pipe(
          map((response: Paginated<Role>) =>
            loadMoreRolesForAutocompletionSuccess({ roles: response.items })
          ),
          catchError((error) => of(loadForAutocompletionFail(error)))
        )
      )
    )
  );

  loadLocation$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadLocation),
      switchMap(() =>
        this.settingService.loadSetting().pipe(
          map((response: Setting) =>
            loadLocationSuccess(response.contact as Contact)
          ),
          catchError((error) => of(loadLocationFail(error)))
        )
      )
    )
  );

  loadLocations$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadLocations),
      switchMap(() =>
        this.locationService.loadJobLocation().pipe(
          map((response: LocationJob[]) =>
            loadLocationsSuccess({ locations: response })
          ),
          catchError((error) => of(loadLocationsFail(error)))
        )
      )
    )
  );

  loadAd$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadAd),
      switchMap(() =>
        this.adService.loadAd().pipe(
          map((response: Ad) => loadAdSuccess({ ad: response })),
          catchError((error) => of(loadAdFail(error)))
        )
      )
    )
  );
}
