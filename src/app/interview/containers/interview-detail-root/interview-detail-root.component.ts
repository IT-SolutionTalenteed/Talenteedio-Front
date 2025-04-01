import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InterviewState } from 'src/app/interview/store/reducers/interview.reducer';
import {
  getInterview,
  getInterviewLoading,
} from 'src/app/interview/store/selectors/interview.selector';
import { Interview } from 'src/app/shared/models/interview.interface';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-interview-detail-root',
  templateUrl: './interview-detail-root.component.html',
  styleUrls: ['./interview-detail-root.component.scss'],
})
export class InterviewDetailRootComponent implements OnInit, OnDestroy {
  interviewLoading$: Observable<boolean>;
  interview$: Observable<Interview>;
  interview: Interview;

  sub = new SubSink();
  constructor(
    private interviewStore: Store<InterviewState>,
    private meta: Meta,
    private location: Location,
    private titleService: Title
  ) {
    this.meta.addTag({ property: 'og:test', content: 'test' });
  }
  ngOnInit(): void {
    this.interviewLoading$ = this.interviewStore.pipe(
      select(getInterviewLoading)
    );
    this.interview$ = this.interviewStore.pipe(select(getInterview));
    this.sub.sink = this.interview$.subscribe((interview) => {
      this.interview = interview;
      if (interview) {
        this.titleService.setTitle(`${interview.title} | Talenteed`);
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
    this.meta.addTag({ property: 'og:title', content: this.interview.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.interview.metaDescription,
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
    this.meta.addTag({ property: 'og:title', content: this.interview.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.interview.metaDescription ?? '',
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
      content: this.interview.title,
    });
    this.meta.addTag({
      property: 'twitter:description',
      content: this.interview.metaDescription,
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
