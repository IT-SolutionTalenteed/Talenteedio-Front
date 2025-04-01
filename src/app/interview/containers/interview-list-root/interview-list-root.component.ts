import { Component, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Interview } from 'src/app/shared/models/interview.interface';
import { SubSink } from 'subsink';
import { loadInterviews } from '../../store/actions/interview.actions';
import { InterviewState } from '../../store/reducers/interview.reducer';
import {
  getInterviewListCriteria,
  getInterviews,
  getInterviewsLoading,
  getInterviewsTotalItems,
} from '../../store/selectors/interview.selector';
import { InterviewListCriteria } from '../../types/interview-list-criteria.interface';

@Component({
  selector: 'app-interview-list-root',
  templateUrl: './interview-list-root.component.html',
  styleUrls: ['./interview-list-root.component.scss'],
})
export class InterviewListRootComponent implements OnInit {
  interviewsLoading$: Observable<boolean>;
  interviews$: Observable<Interview[]>;
  totalItems$: Observable<number>;

  interviewCriteria: InterviewListCriteria;

  sub = new SubSink();

  constructor(private interviewStore: Store<InterviewState>) {}

  ngOnInit() {
    this.interviewsLoading$ = this.interviewStore.pipe(
      select(getInterviewsLoading)
    );
    this.interviews$ = this.interviewStore.pipe(select(getInterviews));
    this.totalItems$ = this.interviewStore.pipe(
      select(getInterviewsTotalItems)
    );
    this.sub.sink = this.interviewStore
      .select(getInterviewListCriteria)
      .subscribe((criteria) => (this.interviewCriteria = cloneDeep(criteria)));
  }

  onPaginate(page) {
    this.interviewCriteria.page = page;
    this.interviewStore.dispatch(loadInterviews(this.interviewCriteria));
  }

  onSaveFilter(filter) {
    this.interviewCriteria.filter = filter;
    this.interviewStore.dispatch(
      loadInterviews({
        ...this.interviewCriteria,
        page: { ...this.interviewCriteria.page, page: 1 },
      })
    );
  }
}
