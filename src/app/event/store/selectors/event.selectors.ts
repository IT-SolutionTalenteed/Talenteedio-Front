import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Event } from 'src/app/shared/models/event.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { EventState } from '../reducers/event.reducers';

export const getEventState = createFeatureSelector<EventState>('event');

export const getPaginatedEvents = createSelector(
  getEventState,
  (state: EventState) => state.events
);

export const getEvents = createSelector(
  getEventState,
  (state: EventState) => state.events.items
);

export const getEventListCriteria = createSelector(
  getEventState,
  (state: EventState) => state.eventListCriteria
);

export const getEventsLoading = createSelector(
  getEventState,
  (state: EventState) => state.eventsLoading
);

export const getEvent = createSelector(
  getEventState,
  (state: EventState) => state.event
);

export const getEventLoaded = createSelector(
  getEventState,
  (state: EventState) => state.eventLoaded
);

export const getEventLoading = createSelector(
  getEventState,
  (state: EventState) => state.eventLoading
);

export const getEventTotalItems = createSelector(
  getPaginatedEvents,
  (paginatedEvents: Paginated<Event>) => paginatedEvents.totalItems
);
