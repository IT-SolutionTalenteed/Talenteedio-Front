import { createAction, props } from '@ngrx/store';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { InterviewListCriteria } from '../../types/interview-list-criteria.interface';

export const loadInterviews = createAction(
  '[Interviews] Load Interviews',
  props<InterviewListCriteria>()
);

export const loadInterviewsFail = createAction(
  '[Interviews] Load Interviews Fail',
  props<Error>()
);

export const loadInterviewsSuccess = createAction(
  '[Interviews] Load Interviews Success',
  props<Paginated<Interview>>()
);

export const loadInterview = createAction(
  '[Interview] Load Interview',
  props<{ id: string }>()
);

export const loadInterviewSuccess = createAction(
  '[Interview] Load Interview Success',
  props<Interview>()
);

export const loadInterviewFail = createAction(
  '[Interview] Load Interview Fail',
  props<Error>()
);
