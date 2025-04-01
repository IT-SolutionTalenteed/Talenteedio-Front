import { Action, createReducer, on } from '@ngrx/store';
import { Job } from 'src/app/shared/models/job.interface';
import { UserDocument } from 'src/app/shared/models/user-document';
import {
  applyForJob,
  applyForJobFail,
  applyForJobSuccess,
  loadApplyJobCriteria,
  loadApplyJobCriteriaFail,
  loadApplyJobCriteriaSuccess,
  loadJob,
  loadJobFail,
  loadJobSuccess,
  referJob,
  referJobFail,
  referJobSuccess,
} from '../actions/job-form.actions';

export interface JobFormState {
  job: Job;
  jobLoading: boolean;
  jobLoaded: boolean;
  CVs: UserDocument[];
  LMs: UserDocument[];
  applyJobCriteriaLoading: boolean;
  applyForJobLoading: boolean;
  applyForJobLoaded: boolean;
  applyForJobError: Error;
  referJobLoading: boolean;
  referJobLoaded: boolean;
  referJobError: Error;
}

const initialState: JobFormState = {
  job: undefined,
  jobLoading: false,
  jobLoaded: false,
  CVs: [],
  LMs: [],
  applyJobCriteriaLoading: false,
  applyForJobLoading: false,
  applyForJobLoaded: false,
  applyForJobError: undefined,
  referJobLoading: false,
  referJobLoaded: false,
  referJobError: undefined,
};

const loadJobReducer = (state: JobFormState): JobFormState => ({
  ...state,
  jobLoading: true,
  jobLoaded: false,
});

const loadJobFailReducer = (state: JobFormState): JobFormState => ({
  ...state,
  jobLoading: false,
  jobLoaded: false,
  job: undefined,
});

const loadJobSuccessReducer = (
  state: JobFormState,
  props: Job
): JobFormState => ({
  ...state,
  jobLoading: false,
  jobLoaded: true,
  job: props,
});

const loadApplyJobCriteriaReducer = (state: JobFormState): JobFormState => ({
  ...state,
  applyJobCriteriaLoading: true,
});

const loadApplyJobCriteriaFailReducer = (
  state: JobFormState
): JobFormState => ({
  ...state,
  applyJobCriteriaLoading: false,
});

const loadApplyJobCriteriaSuccessReducer = (
  state: JobFormState,
  props: { CVs: UserDocument[]; LMs: UserDocument[] }
): JobFormState => ({
  ...state,
  applyJobCriteriaLoading: false,
  CVs: props.CVs,
  LMs: props.LMs,
});

const applyForJobReducer = (state: JobFormState): JobFormState => ({
  ...state,
  applyForJobLoading: true,
  applyForJobLoaded: false,
  applyForJobError: undefined,
});

const applyForJobFailReducer = (
  state: JobFormState,
  props: Error
): JobFormState => ({
  ...state,
  applyForJobLoading: false,
  applyForJobLoaded: false,
  applyForJobError: props,
});

const applyForJobSuccessReducer = (state: JobFormState): JobFormState => ({
  ...state,
  applyForJobLoading: false,
  applyForJobLoaded: true,
});

const referJobReducer = (state: JobFormState): JobFormState => ({
  ...state,
  referJobLoading: true,
  referJobLoaded: false,
  referJobError: undefined,
});

const referJobFailReducer = (
  state: JobFormState,
  props: Error
): JobFormState => ({
  ...state,
  referJobLoading: false,
  referJobLoaded: false,
  referJobError: props,
});

const referJobSuccessReducer = (state: JobFormState): JobFormState => ({
  ...state,
  referJobLoading: false,
  referJobLoaded: true,
});

const reducer = createReducer(
  initialState,
  on(loadJob, loadJobReducer),
  on(loadJobFail, loadJobFailReducer),
  on(loadJobSuccess, loadJobSuccessReducer),
  on(loadApplyJobCriteria, loadApplyJobCriteriaReducer),
  on(loadApplyJobCriteriaSuccess, loadApplyJobCriteriaSuccessReducer),
  on(loadApplyJobCriteriaFail, loadApplyJobCriteriaFailReducer),
  on(applyForJob, applyForJobReducer),
  on(applyForJobSuccess, applyForJobSuccessReducer),
  on(applyForJobFail, applyForJobFailReducer),
  on(referJob, referJobReducer),
  on(referJobSuccess, referJobSuccessReducer),
  on(referJobFail, referJobFailReducer)
);

export function jobFormReducer(
  state: JobFormState | undefined,
  action: Action
) {
  return reducer(state, action);
}
