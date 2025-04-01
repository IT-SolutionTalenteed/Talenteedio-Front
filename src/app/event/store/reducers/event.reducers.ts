import { Action, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Event } from 'src/app/shared/models/event.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { EVENT_DEFAULT_CRITERIA } from '../../constants/event.constant';
import { EventListCriteria } from '../../types/event-list-criteria.interface';
import {
  loadEvent,
  loadEventFail,
  loadEventSuccess,
  loadEvents,
  loadEventsFail,
  loadEventsSuccess,
} from '../actions/event.actions';

export interface EventState {
  events: Paginated<Event>;
  eventsLoading: boolean;
  eventsLoaded: boolean;
  eventListCriteria: EventListCriteria;
  event: Event;
  eventLoading: boolean;
  eventLoaded: boolean;
}

const initialState: EventState = {
  events: { items: [], totalItems: 0 },
  eventsLoading: false,
  eventsLoaded: false,
  eventListCriteria: cloneDeep(EVENT_DEFAULT_CRITERIA),
  event: undefined,
  eventLoading: false,
  eventLoaded: false,
};

const loadEventsReducer = (
  state: EventState,
  props: EventListCriteria
): EventState => ({
  ...state,
  eventsLoading: true,
  eventsLoaded: false,
  eventListCriteria: props,
});

const loadEventsFailReducer = (state: EventState): EventState => ({
  ...state,
  eventsLoading: false,
  eventsLoaded: false,
});

const loadEventsSuccessReducer = (
  state: EventState,
  props: Paginated<Event>
): EventState => ({
  ...state,
  eventsLoading: false,
  eventsLoaded: true,
  events: props,
});

const loadEventReducer = (state: EventState): EventState => ({
  ...state,
  eventLoading: true,
  eventLoaded: false,
});

const loadEventFailReducer = (state: EventState): EventState => ({
  ...state,
  eventLoading: false,
  eventLoaded: false,
  event: undefined,
});

const loadEventSuccessReducer = (
  state: EventState,
  props: Event
): EventState => ({
  ...state,
  eventLoading: false,
  eventLoaded: true,
  event: props,
});

const reducer = createReducer(
  initialState,
  on(loadEvents, loadEventsReducer),
  on(loadEventsFail, loadEventsFailReducer),
  on(loadEventsSuccess, loadEventsSuccessReducer),
  on(loadEvent, loadEventReducer),
  on(loadEventFail, loadEventFailReducer),
  on(loadEventSuccess, loadEventSuccessReducer)
);

export function eventReducer(state: EventState | undefined, action: Action) {
  return reducer(state, action);
}
