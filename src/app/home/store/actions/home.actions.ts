import { createAction, props } from '@ngrx/store';
import { Article } from 'src/app/shared/models/article.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Partner } from 'src/app/shared/models/partner.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { Testimonial } from 'src/app/shared/models/testimonial.interface';
import { Job } from './../../../shared/models/job.interface';

export const loadJobs = createAction('[Home] Load Jobs');

export const loadJobsFail = createAction(
  '[Home] Load Jobs Fail',
  props<Error>()
);

export const loadJobsSuccess = createAction(
  '[Home] Load Jobs Success',
  props<{ payload: Job[] }>()
);

export const loadArticles = createAction('[Home] Load Articles');

export const loadArticlesFail = createAction(
  '[Home] Load Articles Fail',
  props<Error>()
);

export const loadArticlesSuccess = createAction(
  '[Home] Load Articles Success',
  props<{ payload: Article[] }>()
);

export const loadInterview = createAction('[Home] Load Interview');

export const loadInterviewFail = createAction(
  '[Home] Load Interview Fail',
  props<Error>()
);

export const loadInterviewSuccess = createAction(
  '[Home] Load Interview Success',
  props<{ payload: Interview[] }>()
);

export const loadTestimonials = createAction('[Home] Load Testimonials');

export const loadTestimonialsFail = createAction(
  '[Home] Load Testimonials Fail',
  props<Error>()
);

export const loadTestimonialsSuccess = createAction(
  '[Home] Load Testimonials Success',
  props<{ payload: Testimonial[] }>()
);

export const loadPartners = createAction('[Home] Load Partners');

export const loadPartnersFail = createAction(
  '[Home] Load Partners Fail',
  props<Error>()
);

export const loadPartnersSuccess = createAction(
  '[Home] Load Partners Success',
  props<{ payload: Partner[] }>()
);

export const loadHomeSetting = createAction('[Home] Load Home Setting');

export const loadHomeSettingFail = createAction(
  '[Home] Load Home Setting Fail',
  props<Error>()
);

export const loadHomeSettingSuccess = createAction(
  '[Home] Load Home Setting Success',
  props<Partial<Setting>>()
);

export const loadCompanies = createAction('[Home] Load Companies');

export const loadCompaniesFail = createAction(
  '[Home] Load Companies Fail',
  props<Error>()
);

export const loadCompaniesSuccess = createAction(
  '[Home] Load Companies Success',
  props<{ payload: Company[] }>()
);

export const loadUpcomingEvents = createAction('[Home] Load Upcoming Events');

export const loadUpcomingEventsFail = createAction(
  '[Home] Load Upcoming Events Fail',
  props<Error>()
);

export const loadUpcomingEventsSuccess = createAction(
  '[Home] Load Upcoming Events Success',
  props<{ payload: any[] }>()
);
