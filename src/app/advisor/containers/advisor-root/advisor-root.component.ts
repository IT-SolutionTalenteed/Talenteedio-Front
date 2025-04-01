import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import { Article } from 'src/app/shared/models/article.interface';
import { Event } from 'src/app/shared/models/event.interface';
import { Job } from 'src/app/shared/models/job.interface';
import { SubSink } from 'subsink';
import { AdvisorState } from '../../store/reducers/advisor.reducers';
import {
  getAdvisorDataLoading,
  getEvents,
  getEventsDates,
  getNews,
  getPopularJob,
} from '../../store/selectors/advisor.selectors';

@Component({
  selector: 'app-advisor-root',
  templateUrl: './advisor-root.component.html',
  styleUrls: ['./advisor-root.component.scss'],
})
export class AdvisorRootComponent implements OnInit, OnDestroy {
  readonly advisorStore = inject(Store<AdvisorState>);
  news$: Observable<Partial<Article> | undefined>;
  popularJob$: Observable<Partial<Job> | undefined>;
  events$: Observable<Partial<Event>[]>;
  eventsDates$: Observable<Date[]>;

  dataLoading$: Observable<boolean>;

  events: Partial<Event>[];

  subs = new SubSink();

  constructor(private router: Store<AppRouterState>) {}

  ngOnInit(): void {
    this.news$ = this.advisorStore.pipe(select(getNews));
    this.popularJob$ = this.advisorStore.pipe(select(getPopularJob));
    this.events$ = this.advisorStore.pipe(select(getEvents));
    this.eventsDates$ = this.advisorStore.pipe(select(getEventsDates));
    this.dataLoading$ = this.advisorStore.pipe(select(getAdvisorDataLoading));
    this.subs.sink = this.events$.subscribe((events) => (this.events = events));
  }

  onSelectDate(date: Date) {
    const selectedEvent = this.events.find((event) =>
      moment(event.date).isSame(date)
    );
    this.router.dispatch(go({ path: [`/event/detail/${selectedEvent.slug}`] }));
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
