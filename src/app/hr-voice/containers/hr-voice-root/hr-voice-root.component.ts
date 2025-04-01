import { Component, OnInit, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Article } from 'src/app/shared/models/article.interface';
import { Interview } from 'src/app/shared/models/interview.interface';
import { HrVoiceState } from '../../store/reducers/hr-voice.reducers';
import {
  getHrVoiceDataLoading,
  getInterview,
  getNews,
  getReplay,
} from '../../store/selectors/hr-voice.selectors';

@Component({
  selector: 'app-hr-voice-root',
  templateUrl: './hr-voice-root.component.html',
  styleUrls: ['./hr-voice-root.component.scss'],
})
export class HrVoiceRootComponent implements OnInit {
  news$: Observable<Partial<Article>[]>;
  interview$: Observable<Interview[]>;
  replay$: Observable<Interview[]>;
  dataLoading$: Observable<boolean>;
  hrVoiceStore = inject(Store<HrVoiceState>);
  ngOnInit(): void {
    this.news$ = this.hrVoiceStore.pipe(select(getNews));
    this.interview$ = this.hrVoiceStore.pipe(select(getInterview));
    this.replay$ = this.hrVoiceStore.pipe(select(getReplay));
    this.dataLoading$ = this.hrVoiceStore.pipe(select(getHrVoiceDataLoading));
  }
}
