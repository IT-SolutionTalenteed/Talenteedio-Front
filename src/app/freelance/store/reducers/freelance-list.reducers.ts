import { createReducer, on } from '@ngrx/store';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { FreelanceListCriteria } from '../../types/freelance-list-criteria.interface';
import * as FreelanceListActions from '../actions/freelance-list.actions';

export interface FreelanceListState {
  jobs: Job[];
  jobTypes: JobType[];
  categories: Category[];
  companies: Company[];
  didYouKnow: string | null;
  jobsLoading: boolean;
  companiesLoading: boolean;
  totalItems: number;
  criteria: FreelanceListCriteria;
  error: any;
}

export const initialState: FreelanceListState = {
  jobs: [],
  jobTypes: [],
  categories: [],
  companies: [],
  didYouKnow: null,
  jobsLoading: false,
  companiesLoading: false,
  totalItems: 0,
  criteria: {
    filter: {
      search: undefined,
      location: null,
      jobTypes: [],
      datePosted: undefined,
      experienceLevels: null,
      adminId: '',
      companyId: '',
      status: '',
      category: null,
      salaryMin: 0,
      salaryMax: 0,
      isFeatured: undefined,
    },
    page: {
      page: 1,
      pageSize: 10,
    },
  },
  error: null,
};

export const freelanceListReducer = createReducer(
  initialState,
  on(FreelanceListActions.loadFreelanceJobs, (state, criteria) => ({
    ...state,
    jobsLoading: true,
    criteria,
  })),
  on(FreelanceListActions.loadFreelanceJobsSuccess, (state, { jobs, totalItems }) => ({
    ...state,
    jobs,
    totalItems,
    jobsLoading: false,
  })),
  on(FreelanceListActions.loadFreelanceJobsFailure, (state, { error }) => ({
    ...state,
    error,
    jobsLoading: false,
  })),
  on(FreelanceListActions.loadJobTypesSuccess, (state, { jobTypes }) => ({
    ...state,
    jobTypes,
  })),
  on(FreelanceListActions.loadJobCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
  })),
  on(FreelanceListActions.loadCompanies, (state) => ({
    ...state,
    companiesLoading: true,
  })),
  on(FreelanceListActions.loadCompaniesSuccess, (state, { companies }) => ({
    ...state,
    companies,
    companiesLoading: false,
  })),
  on(FreelanceListActions.loadCompaniesFailure, (state, { error }) => ({
    ...state,
    error,
    companiesLoading: false,
  })),
  on(FreelanceListActions.loadDidYouKnowSuccess, (state, { didYouKnow }) => ({
    ...state,
    didYouKnow,
  }))
);
