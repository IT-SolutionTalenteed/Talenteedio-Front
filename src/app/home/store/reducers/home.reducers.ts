import { Action, createReducer, on } from '@ngrx/store';
import { Article } from 'src/app/shared/models/article.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { Job } from 'src/app/shared/models/job.interface';
import { Partner } from 'src/app/shared/models/partner.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { Testimonial } from 'src/app/shared/models/testimonial.interface';

import { Interview } from 'src/app/shared/models/interview.interface';
import {
  loadArticles,
  loadArticlesFail,
  loadArticlesSuccess,
  loadCompanies,
  loadCompaniesFail,
  loadCompaniesSuccess,
  loadHomeSetting,
  loadHomeSettingFail,
  loadHomeSettingSuccess,
  loadInterview,
  loadInterviewFail,
  loadInterviewSuccess,
  loadJobs,
  loadJobsFail,
  loadJobsSuccess,
  loadPartners,
  loadPartnersFail,
  loadPartnersSuccess,
  loadTestimonials,
  loadTestimonialsFail,
  loadTestimonialsSuccess,
} from '../actions/home.actions';

export interface HomeState {
  jobs: Job[];
  jobsLoading: boolean;
  jobsLoaded: boolean;
  articles: Article[];
  articlesLoading: boolean;
  articlesLoaded: boolean;
  interview: Interview[];
  interviewLoading: boolean;
  interviewLoaded: boolean;
  testimonials: Testimonial[];
  testimonialsLoading: boolean;
  testimonialsLoaded: boolean;
  homeSetting: Partial<Setting>;
  homeSettingLoading: boolean;
  homeSettingLoaded: boolean;
  partners: Partial<Partner>[];
  partnersLoading: boolean;
  partnersLoaded: boolean;
  companies: Company[];
  companiesLoading: boolean;
  companiesLoaded: boolean;
}

const initialState: HomeState = {
  jobs: [],
  jobsLoading: false,
  jobsLoaded: false,
  articles: [],
  articlesLoading: false,
  articlesLoaded: false,
  interview: undefined,
  interviewLoading: false,
  interviewLoaded: false,
  testimonials: [],
  testimonialsLoading: false,
  testimonialsLoaded: false,
  homeSetting: undefined,
  homeSettingLoading: false,
  homeSettingLoaded: false,
  partners: [],
  partnersLoading: false,
  partnersLoaded: false,
  companies: [],
  companiesLoading: false,
  companiesLoaded: false,
};

const loadJobsReducer = (state: HomeState): HomeState => ({
  ...state,
  jobsLoading: true,
  jobsLoaded: false,
});

const loadJobsFailReducer = (state: HomeState): HomeState => ({
  ...state,
  jobsLoading: false,
  jobsLoaded: false,
});

const loadJobsSuccessReducer = (
  state: HomeState,
  props: { payload: Job[] }
): HomeState => ({
  ...state,
  jobsLoading: false,
  jobsLoaded: true,
  jobs: props.payload,
});

const loadHomeSettingReducer = (state: HomeState): HomeState => ({
  ...state,
  homeSettingLoading: true,
  homeSettingLoaded: false,
});

const loadHomeSettingFailReducer = (state: HomeState): HomeState => ({
  ...state,
  homeSettingLoading: false,
  homeSettingLoaded: false,
});

const loadHomeSettingSuccessReducer = (
  state: HomeState,
  props: Partial<Setting>
): HomeState => ({
  ...state,
  homeSettingLoading: false,
  homeSettingLoaded: true,
  homeSetting: props,
});

const loadArticlesReducer = (state: HomeState): HomeState => ({
  ...state,
  articlesLoading: true,
  articlesLoaded: false,
});

const loadArticlesFailReducer = (state: HomeState): HomeState => ({
  ...state,
  articlesLoading: false,
  articlesLoaded: false,
});

const loadArticlesSuccessReducer = (
  state: HomeState,
  props: { payload: Article[] }
): HomeState => ({
  ...state,
  articlesLoading: false,
  articlesLoaded: true,
  articles: props.payload,
});

const loadInterviewReducer = (state: HomeState): HomeState => ({
  ...state,
  interviewLoading: true,
  interviewLoaded: false,
});

const loadInterviewFailReducer = (state: HomeState): HomeState => ({
  ...state,
  interviewLoading: false,
  interviewLoaded: false,
});

const loadInterviewSuccessReducer = (
  state: HomeState,
  props: { payload: Interview[] }
): HomeState => ({
  ...state,
  interviewLoading: false,
  interviewLoaded: true,
  interview: props.payload,
});

const loadTestimonialsReducer = (state: HomeState): HomeState => ({
  ...state,
  testimonialsLoading: true,
  testimonialsLoaded: false,
});

const loadTestimonialsFailReducer = (state: HomeState): HomeState => ({
  ...state,
  testimonialsLoading: false,
  testimonialsLoaded: false,
});

const loadTestimonialsSuccessReducer = (
  state: HomeState,
  props: { payload: Testimonial[] }
): HomeState => ({
  ...state,
  testimonialsLoading: false,
  testimonialsLoaded: true,
  testimonials: props.payload,
});

const loadPartnersReducer = (state: HomeState): HomeState => ({
  ...state,
  partnersLoading: true,
  partnersLoaded: false,
});

const loadPartnersFailReducer = (state: HomeState): HomeState => ({
  ...state,
  partnersLoading: false,
  partnersLoaded: false,
});

const loadPartnersSuccessReducer = (
  state: HomeState,
  props: { payload: Partner[] }
): HomeState => ({
  ...state,
  partnersLoading: false,
  partnersLoaded: true,
  partners: props.payload,
});

const loadCompaniesReducer = (state: HomeState): HomeState => ({
  ...state,
  companiesLoading: true,
  companiesLoaded: false,
});

const loadCompaniesFailReducer = (state: HomeState): HomeState => ({
  ...state,
  companiesLoading: false,
  companiesLoaded: false,
});

const loadCompaniesSuccessReducer = (
  state: HomeState,
  props: { payload: Company[] }
): HomeState => ({
  ...state,
  companiesLoading: false,
  companiesLoaded: true,
  companies: props.payload,
});

const reducer = createReducer(
  initialState,
  on(loadHomeSetting, loadHomeSettingReducer),
  on(loadHomeSettingFail, loadHomeSettingFailReducer),
  on(loadHomeSettingSuccess, loadHomeSettingSuccessReducer),
  on(loadJobs, loadJobsReducer),
  on(loadJobsFail, loadJobsFailReducer),
  on(loadJobsSuccess, loadJobsSuccessReducer),
  on(loadArticles, loadArticlesReducer),
  on(loadArticlesFail, loadArticlesFailReducer),
  on(loadArticlesSuccess, loadArticlesSuccessReducer),
  on(loadInterview, loadInterviewReducer),
  on(loadInterviewFail, loadInterviewFailReducer),
  on(loadInterviewSuccess, loadInterviewSuccessReducer),
  on(loadTestimonials, loadTestimonialsReducer),
  on(loadTestimonialsFail, loadTestimonialsFailReducer),
  on(loadTestimonialsSuccess, loadTestimonialsSuccessReducer),
  on(loadPartners, loadPartnersReducer),
  on(loadPartnersFail, loadPartnersFailReducer),
  on(loadPartnersSuccess, loadPartnersSuccessReducer),
  on(loadCompanies, loadCompaniesReducer),
  on(loadCompaniesFail, loadCompaniesFailReducer),
  on(loadCompaniesSuccess, loadCompaniesSuccessReducer)
);

export function homeReducer(state: HomeState | undefined, action: Action) {
  return reducer(state, action);
}
