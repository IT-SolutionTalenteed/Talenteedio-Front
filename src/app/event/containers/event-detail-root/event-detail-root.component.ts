import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Event } from 'src/app/shared/models/event.interface';
import { SubSink } from 'subsink';
import { EventState } from '../../store/reducers/event.reducers';
import {
  getEvent,
  getEventLoading,
} from '../../store/selectors/event.selectors';

@Component({
  selector: 'app-event-detail-root',
  templateUrl: './event-detail-root.component.html',
  styleUrls: ['./event-detail-root.component.scss'],
})
export class EventDetailRootComponent implements OnInit, OnDestroy {
  eventLoading$: Observable<boolean>;
  event$: Observable<Event>;
  event: Event;

  sub = new SubSink();
  constructor(
    private eventStore: Store<EventState>,
    private meta: Meta,
    private location: Location,
    private titleService: Title
  ) {
    this.meta.addTag({ property: 'og:test', content: 'test' });
  }
  ngOnInit(): void {
    this.eventLoading$ = this.eventStore.pipe(select(getEventLoading));
    this.event$ = this.eventStore.pipe(select(getEvent));
    this.sub.sink = this.event$.subscribe((event) => {
      this.event = event;
      if (event) {
        this.titleService.setTitle(`${event.title} | Talenteed`);
        this.initMeta();
      }
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  initMeta() {
    this.initFacebookMeta();
    this.initTwitterMeta();
    this.initPinterestMeta();
    this.initLinkedInMeta();
  }
  initFacebookMeta() {
    // facebook
    this.meta.addTag({ property: 'og:title', content: this.event.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.event.metaDescription,
    });
    this.meta.addTag({
      property: 'og:image',
      content: '/assets/img/thumb.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: this.location.prepareExternalUrl(this.location.path()),
    });
    this.meta.addTag({
      property: 'og:type',
      content: 'website',
    });
  }
  initLinkedInMeta() {
    // LinkedIn
    this.meta.addTag({ property: 'og:title', content: this.event.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.event.metaDescription ?? '',
    });
    this.meta.addTag({
      property: 'og:image',
      content: '/assets/img/thumb.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: this.location.prepareExternalUrl(this.location.path()),
    });
    this.meta.addTag({
      property: 'og:type',
      content: 'website',
    });
    this.meta.addTag({
      property: 'og:site_name',
      content: 'Talenteed.io',
    });
  }
  initTwitterMeta() {
    this.meta.addTag({
      property: 'twitter:title',
      content: this.event.title,
    });
    this.meta.addTag({
      property: 'twitter:description',
      content: this.event.metaDescription,
    });
    this.meta.addTag({
      property: 'twitter:image',
      content: '/assets/img/thumb.jpg',
    });
  }
  initPinterestMeta() {
    this.meta.addTag({
      property: 'pinterest-rich-pin',
      content: 'true',
    });
  }
}
