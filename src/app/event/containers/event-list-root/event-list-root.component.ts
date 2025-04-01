import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { Event } from 'src/app/shared/models/event.interface';
import { SubSink } from 'subsink';
import { loadEvents } from '../../store/actions/event.actions';
import { EventState } from '../../store/reducers/event.reducers';
import {
  getEventListCriteria,
  getEventTotalItems,
  getEvents,
  getEventsLoading,
} from '../../store/selectors/event.selectors';
import { EventListCriteria } from '../../types/event-list-criteria.interface';

@Component({
  selector: 'app-event-list-root',
  templateUrl: './event-list-root.component.html',
  styleUrls: ['./event-list-root.component.scss'],
})
export class EventListRootComponent implements OnInit, OnDestroy {
  eventsLoading$: Observable<boolean>;
  events$: Observable<Event[]>;
  eventCriteria: EventListCriteria;
  totalItems$: Observable<number>;

  subs = new SubSink();

  constructor(private eventStore: Store<EventState>) {}

  ngOnInit() {
    this.events$ = this.eventStore.pipe(select(getEvents));
    this.totalItems$ = this.eventStore.pipe(select(getEventTotalItems));
    this.eventsLoading$ = this.eventStore.select(getEventsLoading);
    this.subs.sink = this.eventStore
      .select(getEventListCriteria)
      .subscribe((criteria) => (this.eventCriteria = cloneDeep(criteria)));
  }
  onSaveFilter(filter) {
    this.eventCriteria.filter = filter;
    this.eventStore.dispatch(
      loadEvents({
        ...this.eventCriteria,
        page: { ...this.eventCriteria.page, page: 1 },
      })
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  onPaginate(page) {
    this.eventCriteria.page = page;
    this.eventStore.dispatch(loadEvents(this.eventCriteria));
  }
}
