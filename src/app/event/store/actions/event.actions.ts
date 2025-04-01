import { createAction, props } from '@ngrx/store';
import { Event } from 'src/app/shared/models/event.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { EventListCriteria } from '../../types/event-list-criteria.interface';

export const loadEvents = createAction(
  '[Event] Load Events',
  props<EventListCriteria>()
);

export const loadEventsFail = createAction(
  '[Event] Load Events Fail',
  props<Error>()
);

export const loadEventsSuccess = createAction(
  '[Event] Load Events Success',
  props<Paginated<Event>>()
);

export const loadEvent = createAction(
  '[Event] Load Event',
  props<{ id: string }>()
);

export const loadEventSuccess = createAction(
  '[Event] Load Event Success',
  props<Event>()
);

export const loadEventFail = createAction(
  '[Event] Load Event Fail',
  props<Error>()
);
