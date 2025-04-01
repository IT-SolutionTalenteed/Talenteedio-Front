import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppRouterState } from '../reducers/router.reducers';

export const getRouterState =
  createFeatureSelector<RouterReducerState<AppRouterState>>('router');

export const getUrl = createSelector(
  getRouterState,
  (router) => router?.state.url
);

export const getBrowserRefresh = createSelector(
  getRouterState,
  (router) => !!(router && router.navigationId === 1)
);

export const getTitle = createSelector(
  getRouterState,
  (router) => router?.state?.data?.title
);

export const getIsHomePage = createSelector(getUrl, (url) => url === '/home');

export const getMotiveId = createSelector(
  getRouterState,
  (router) => router?.state?.queryParams['motiveId']
);

export const getIsBackOfficeRoute = createSelector(getUrl, (url) =>
  url.split('?')[0].includes('back-office')
);

export const getIsAuthenticationRoute = createSelector(getUrl, (url) =>
  url.split('?')[0].includes('authentication')
);
