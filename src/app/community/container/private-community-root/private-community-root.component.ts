import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { CommunityState } from 'src/app/community/store/reducers/community.reducers';
import { getCommunityDataLoading } from 'src/app/community/store/selectors/community.selectors';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { AppRouterState } from 'src/app/routeur/store/reducers/router.reducers';
import { Article } from 'src/app/shared/models/article.interface';
import { Event } from 'src/app/shared/models/event.interface';
import { Job } from 'src/app/shared/models/job.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { SubSink } from 'subsink';
import {
  getEvents,
  getEventsDates,
  getNews,
} from '../../store/selectors/community.selectors';

@Component({
  selector: 'app-private-community-root',
  templateUrl: './private-community-root.component.html',
  styleUrls: ['./private-community-root.component.scss'],
})
export class PrivateCommunityRootComponent implements OnInit, OnDestroy {
  @Input() homeSettingLoading: boolean;
  private sanitizer = inject(DomSanitizer);
  content: SafeHtml;
  @Input() set homeSetting(value: Partial<Setting>) {
    this.content = value?.initiative
      ? this.sanitizer.bypassSecurityTrustHtml(value.initiative)
      : undefined;
  }

  readonly communityStore = inject(Store<CommunityState>);
  news$: Observable<Partial<Article>[]>;
  popularJob$: Observable<Partial<Job> | undefined>;
  events$: Observable<Partial<Event>[]>;
  eventsDates$: Observable<Date[]>;

  dataLoading$: Observable<boolean>;

  events: Partial<Event>[];

  subs = new SubSink();

  constructor(private router: Store<AppRouterState>) {}

  ngOnInit(): void {
    this.news$ = this.communityStore.pipe(select(getNews));
    this.events$ = this.communityStore.pipe(select(getEvents));
    this.eventsDates$ = this.communityStore.pipe(select(getEventsDates));
    this.dataLoading$ = this.communityStore.pipe(
      select(getCommunityDataLoading)
    );
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
