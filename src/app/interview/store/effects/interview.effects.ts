import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { InterviewService } from '../../services/interview.service';
import { InterviewListCriteria } from '../../types/interview-list-criteria.interface';
import {
  loadInterview,
  loadInterviewFail,
  loadInterviewSuccess,
  loadInterviews,
  loadInterviewsFail,
  loadInterviewsSuccess,
} from '../actions/interview.actions';
import { InterviewState } from '../reducers/interview.reducer';

@Injectable()
export class InterviewEffects {
  constructor(
    private action$: Actions,
    private interviewService: InterviewService,
    private store: Store<InterviewState>
  ) {}

  loadInterviews$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadInterviews),
      switchMap((props: InterviewListCriteria) =>
        this.interviewService.loadInterviews(props).pipe(
          map((response: Paginated<Interview>) =>
            loadInterviewsSuccess(response)
          ),
          catchError((error) => of(loadInterviewsFail(error)))
        )
      )
    )
  );

  loadInterview$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadInterview),
      switchMap((props: { id: string }) =>
        this.interviewService.loadInterview(props.id).pipe(
          map((response: Interview) => loadInterviewSuccess(response)),
          catchError((error) => of(loadInterviewFail(error)))
        )
      )
    )
  );
}
