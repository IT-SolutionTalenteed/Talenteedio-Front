import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Role } from 'src/app/shared/models/role.interface';
import { Ad } from '../../models/ad.interface';
import { Contact } from '../../models/contact.interface';
import { LocationJob } from '../../models/location-job.interface';
import { ListCriteria } from '../../types/list-criteria.interface';

export const loadForAutocompletionFail = createAction(
  '[Shared] Load For Autocompletion Failed',
  props<{ error: HttpErrorResponse }>()
);

export const loadRolesForAutocompletion = createAction(
  '[Shared] Load Roles For Autocompletion',
  props<ListCriteria>()
);

export const loadRolesForAutocompletionSuccess = createAction(
  '[Shared] Load Roles For Autocompletion Success',
  props<{ roles: Role[] }>()
);

export const loadMoreRolesForAutocompletion = createAction(
  '[Shared] Load More Roles For Autocompletion',
  props<ListCriteria>()
);

export const loadMoreRolesForAutocompletionSuccess = createAction(
  '[Shared] Load More Roles For Autocompletion Success',
  props<{ roles: Role[] }>()
);

export const loadLocation = createAction('[Shared] Load Location');
export const loadLocationSuccess = createAction(
  '[Shared] Load Location Success',
  props<Contact>()
);
export const loadLocationFail = createAction(
  '[Shared] Load Location Fail',
  props<Error>()
);

export const loadLocations = createAction('[Shared] Load Locations');

export const loadLocationsFail = createAction(
  '[Shared] Load Locations Fail',
  props<Error>()
);

export const loadLocationsSuccess = createAction(
  '[Shared] Load Locations Success',
  props<{ locations: LocationJob[] }>()
);

export const loadAd = createAction('[Shared] Load Ad');

export const loadAdFail = createAction('[Shared] Load Ad Fail', props<Error>());

export const loadAdSuccess = createAction(
  '[Shared] Load Ad Success',
  props<{ ad: Ad }>()
);

export const openBecomeMemberModal = createAction(
  '[Shared] Open Become Member Modal'
);

export const closeBecomeMemberModal = createAction(
  '[Shared] Close Become Member Modal'
);
