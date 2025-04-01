import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { Event } from 'src/app/shared/models/event.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { EventService } from '../../services/event.service';
import { EventListCriteria } from '../../types/event-list-criteria.interface';
import {
  loadEvent,
  loadEventFail,
  loadEventSuccess,
  loadEvents,
  loadEventsFail,
  loadEventsSuccess,
} from '../actions/event.actions';
import { EventState } from '../reducers/event.reducers';

@Injectable()
export class EventEffects {
  constructor(
    private action$: Actions,
    private eventService: EventService,
    private store: Store<EventState>
  ) {}

  loadEvents$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadEvents),
      switchMap((props: EventListCriteria) =>
        this.eventService.loadEvents(props).pipe(
          map((response: Paginated<Event>) => loadEventsSuccess(response)),
          catchError((error) => of(loadEventsFail(error)))
        )
      )
    )
  );
  loadEvent$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadEvent),
      switchMap((props: { id: string }) =>
        this.eventService.loadEvent(props.id).pipe(
          map((response: Event) => loadEventSuccess(response)),
          catchError((error) => of(loadEventFail(error)))
        )
      )
    )
  );
}
