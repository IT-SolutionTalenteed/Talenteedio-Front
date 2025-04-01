import { HttpErrorResponse } from '@angular/common/http';
import { Action, createReducer, on } from '@ngrx/store';
import { Role } from 'src/app/shared/models/role.interface';
import { Ad } from '../../models/ad.interface';
import { Contact } from '../../models/contact.interface';
import { LocationJob } from '../../models/location-job.interface';
import { ListCriteria } from '../../types/list-criteria.interface';
import {
  closeBecomeMemberModal,
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
  openBecomeMemberModal,
} from '../actions/shared.actions';

export interface SharedState {
  loading: boolean;
  roles: Role[];
  location: Contact;
  locationLoading: boolean;
  locations: LocationJob[];
  locationsLoading: boolean;
  isBecomeMemberModalOpen: boolean;
  ad: Ad;
  adLoading: boolean;
}

const initialState: SharedState = {
  loading: false,
  roles: [],
  location: undefined,
  locationLoading: false,
  locations: [],
  locationsLoading: false,
  isBecomeMemberModalOpen: false,
  ad: undefined,
  adLoading: false,
};

const loadForAutocompletionFailReducer = (
  state: SharedState,
  props: { error: HttpErrorResponse }
): SharedState => ({
  ...state,
  loading: false,
});

const loadRolesForAutocompletionReducer = (
  state: SharedState,
  props: ListCriteria
): SharedState => ({
  ...state,
  loading: true,
  roles: [],
});

const loadRolesForAutocompletionSuccessReducer = (
  state: SharedState,
  { roles }
): SharedState => ({
  ...state,
  loading: false,
  roles,
});

const loadMoreRolesForAutocompletionReducer = (
  state: SharedState,
  props: ListCriteria
): SharedState => ({
  ...state,
  loading: true,
});

const loadMoreRolesForAutocompletionSuccessReducer = (
  state: SharedState,
  { roles }
): SharedState => ({
  ...state,
  loading: false,
  roles: [...state.roles, ...roles],
});

const loadLocationReducer = (state: SharedState): SharedState => ({
  ...state,
  location: undefined,
  locationLoading: true,
});

const loadLocationSuccessReducer = (
  state: SharedState,
  props: Contact
): SharedState => ({
  ...state,
  location: props,
  locationLoading: false,
});

const loadLocationFailReducer = (
  state: SharedState,
  props: Error
): SharedState => ({
  ...state,
  locationLoading: false,
});

const loadLocationsReducer = (state: SharedState): SharedState => ({
  ...state,
  locationsLoading: true,
});

const loadLocationsFailReducer = (
  state: SharedState,
  props: Error
): SharedState => ({
  ...state,
  locationsLoading: false,
});

const loadLocationsSuccessReducer = (
  state: SharedState,
  props: { locations: LocationJob[] }
): SharedState => ({
  ...state,
  locationsLoading: false,
  locations: props.locations,
});

const loadAdReducer = (state: SharedState): SharedState => ({
  ...state,
  ad: undefined,
  adLoading: true,
});

const loadAdFailReducer = (state: SharedState, props: Error): SharedState => ({
  ...state,
  adLoading: false,
});

const loadAdSuccessReducer = (
  state: SharedState,
  props: { ad: Ad }
): SharedState => ({
  ...state,
  adLoading: false,
  ad: props.ad,
});

const openBecomeMemberModalReducer = (state: SharedState): SharedState => ({
  ...state,
  isBecomeMemberModalOpen: true,
});

const closeBecomeMemberModalReducer = (state: SharedState): SharedState => ({
  ...state,
  isBecomeMemberModalOpen: false,
});

const reducer = createReducer(
  initialState,
  on(loadForAutocompletionFail, loadForAutocompletionFailReducer),
  on(loadMoreRolesForAutocompletion, loadMoreRolesForAutocompletionReducer),
  on(
    loadMoreRolesForAutocompletionSuccess,
    loadMoreRolesForAutocompletionSuccessReducer
  ),
  on(loadRolesForAutocompletion, loadRolesForAutocompletionReducer),
  on(loadLocation, loadLocationReducer),
  on(loadLocationSuccess, loadLocationSuccessReducer),
  on(loadLocationFail, loadLocationFailReducer),
  on(loadLocations, loadLocationsReducer),
  on(loadLocationsFail, loadLocationsFailReducer),
  on(loadLocationsSuccess, loadLocationsSuccessReducer),
  on(openBecomeMemberModal, openBecomeMemberModalReducer),
  on(closeBecomeMemberModal, closeBecomeMemberModalReducer),
  on(loadAd, loadAdReducer),
  on(loadAdFail, loadAdFailReducer),
  on(loadAdSuccess, loadAdSuccessReducer)
);

export function sharedReducer(state: SharedState | undefined, action: Action) {
  return reducer(state, action);
}
