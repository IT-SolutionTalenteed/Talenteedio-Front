import { NavigationExtras } from '@angular/router';
import { createAction, props } from '@ngrx/store';

export interface RouterActionPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  path: any[];
  query?: object;
  extras?: NavigationExtras;
  id?: string;
}

export interface ScrollActionPayload {
  id: string;
}

export const go = createAction('[Router] Go', props<RouterActionPayload>());
export const scroll = createAction(
  '[Router] Scroll',
  props<ScrollActionPayload>()
);
export const back = createAction('[Router] Back');
export const forward = createAction('[Router] Forward');
export const navigationLaunched = createAction('[Router] Navigation Launch');
export const showSuccess = createAction(
  '[Router] Show Success',
  props<{ message?: string }>()
);
