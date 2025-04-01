import { Action, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Company } from 'src/app/shared/models/company.interface';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { JOB_LIST_DEFAULT_CRITERIA } from '../../constants/job-list.constant';
import { JobListCriteria } from '../../types/job-list-criteria.interface';
import {
  loadCategories,
  loadCategoriesFail,
  loadCategoriesSuccess,
  loadCompanies,
  loadCompaniesFail,
  loadCompaniesSuccess,
  loadDidYouKnow,
  loadDidYouKnowFail,
  loadDidYouKnowSuccess,
  loadJobTypes,
  loadJobTypesFail,
  loadJobTypesSuccess,
  loadJobs,
  loadJobsFail,
  loadJobsSuccess,
} from '../actions/job-list.actions';

export interface JobListState {
  jobs: Paginated<Job>;
  jobsLoading: boolean;
  jobsLoaded: boolean;
  jobListCriteria: JobListCriteria;
  jobTypes: JobType[];
  jobTypesLoading: boolean;
  jobTypesLoaded: boolean;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesLoaded: boolean;
  companies: Company[];
  companiesLoading: boolean;
  companiesLoaded: boolean;
  didYouKnow: string | null;
  didYouKnowLoading: boolean;
  didYouKnowLoaded: boolean;
}

const initialState: JobListState = {
  jobs: { items: [], totalItems: 0 },
  jobsLoading: false,
  jobsLoaded: false,
  jobListCriteria: cloneDeep(JOB_LIST_DEFAULT_CRITERIA),
  jobTypes: [],
  jobTypesLoading: false,
  jobTypesLoaded: false,
  categories: [],
  categoriesLoading: false,
  categoriesLoaded: false,
  companies: [],
  companiesLoading: false,
  companiesLoaded: false,
  didYouKnow: '',
  didYouKnowLoading: false,
  didYouKnowLoaded: false,
};

const loadJobsReducer = (
  state: JobListState,
  props: JobListCriteria
): JobListState => ({
  ...state,
  jobsLoading: true,
  jobsLoaded: false,
  jobListCriteria: props,
});

const loadJobsFailReducer = (state: JobListState): JobListState => ({
  ...state,
  jobsLoading: false,
  jobsLoaded: false,
});

const loadJobsSuccessReducer = (
  state: JobListState,
  props: Paginated<Job>
): JobListState => ({
  ...state,
  jobsLoading: false,
  jobsLoaded: true,
  jobs: props,
});

const loadJobTypesReducer = (state: JobListState): JobListState => ({
  ...state,
  jobTypesLoading: true,
  jobTypesLoaded: false,
});

const loadJobTypesFailReducer = (state: JobListState): JobListState => ({
  ...state,
  jobTypesLoading: false,
  jobTypesLoaded: false,
});

const loadJobTypesSuccessReducer = (
  state: JobListState,
  props: { payload: JobType[] }
): JobListState => ({
  ...state,
  jobTypesLoading: false,
  jobTypesLoaded: true,
  jobTypes: props.payload,
});

const loadCategoriesReducer = (state: JobListState): JobListState => ({
  ...state,
  categoriesLoading: true,
  categoriesLoaded: false,
});

const loadCategoriesFailReducer = (state: JobListState): JobListState => ({
  ...state,
  categoriesLoading: false,
  categoriesLoaded: false,
});

const loadCategoriesSuccessReducer = (
  state: JobListState,
  props: { payload: Category[] }
): JobListState => ({
  ...state,
  categoriesLoading: false,
  categoriesLoaded: true,
  categories: props.payload,
});

const loadCompaniesReducer = (state: JobListState): JobListState => ({
  ...state,
  companiesLoading: true,
  companiesLoaded: false,
});

const loadCompaniesFailReducer = (state: JobListState): JobListState => ({
  ...state,
  companiesLoading: false,
  companiesLoaded: false,
});

const loadCompaniesSuccessReducer = (
  state: JobListState,
  props: { payload: Company[] }
): JobListState => ({
  ...state,
  companiesLoading: false,
  companiesLoaded: true,
  companies: props.payload,
});

const loadDidYouKnowReducer = (state: JobListState): JobListState => ({
  ...state,
  didYouKnowLoading: true,
  didYouKnowLoaded: false,
});

const loadDidYouKnowFailReducer = (state: JobListState): JobListState => ({
  ...state,
  didYouKnowLoading: false,
  didYouKnowLoaded: false,
});

const loadDidYouKnowSuccessReducer = (
  state: JobListState,
  props: { payload: string }
): JobListState => ({
  ...state,
  didYouKnowLoading: false,
  didYouKnowLoaded: true,
  didYouKnow: props.payload,
});

const reducer = createReducer(
  initialState,
  on(loadJobs, loadJobsReducer),
  on(loadJobsFail, loadJobsFailReducer),
  on(loadJobsSuccess, loadJobsSuccessReducer),
  on(loadJobTypes, loadJobTypesReducer),
  on(loadJobTypesFail, loadJobTypesFailReducer),
  on(loadJobTypesSuccess, loadJobTypesSuccessReducer),
  on(loadCategories, loadCategoriesReducer),
  on(loadCategoriesFail, loadCategoriesFailReducer),
  on(loadCategoriesSuccess, loadCategoriesSuccessReducer),
  on(loadCompanies, loadCompaniesReducer),
  on(loadCompaniesFail, loadCompaniesFailReducer),
  on(loadCompaniesSuccess, loadCompaniesSuccessReducer),
  on(loadDidYouKnow, loadDidYouKnowReducer),
  on(loadDidYouKnowFail, loadDidYouKnowFailReducer),
  on(loadDidYouKnowSuccess, loadDidYouKnowSuccessReducer)
);

export function jobListReducer(
  state: JobListState | undefined,
  action: Action
) {
  return reducer(state, action);
}
