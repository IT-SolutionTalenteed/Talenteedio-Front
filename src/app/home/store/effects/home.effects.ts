import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { BlogService } from 'src/app/blog/services/blog.service';
import { JobListService } from 'src/app/job-list/services/job-list.service';
import { Article } from 'src/app/shared/models/article.interface';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Partner } from 'src/app/shared/models/partner.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { Testimonial } from 'src/app/shared/models/testimonial.interface';
import { SettingService } from 'src/app/shared/services/setting.service';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import {
  HOME_ARTICLE_CRITERIA,
  HOME_JOB_CRITERIA,
} from '../../constants/home.constant';
import { HomeService } from '../../services/home.service';
import {
  loadArticles,
  loadArticlesFail,
  loadArticlesSuccess,
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

@Injectable()
export class HomeEffects {
  private settingService = inject(SettingService);
  constructor(
    private action$: Actions,
    private homeService: HomeService,
    private bloagService: BlogService,
    private jobService: JobListService
  ) {}

  loadJobs$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadJobs),
      switchMap(() =>
        this.jobService.loadJobs(HOME_JOB_CRITERIA).pipe(
          map((response) => loadJobsSuccess({ payload: response.items })),
          catchError((error) => of(loadJobsFail(error)))
        )
      )
    )
  );

  loadArticles$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadArticles),
      switchMap(() =>
        this.bloagService.loadArticles(HOME_ARTICLE_CRITERIA).pipe(
          map((response: Paginated<Article>) =>
            loadArticlesSuccess({ payload: response.items })
          ),
          catchError((error) => of(loadArticlesFail(error)))
        )
      )
    )
  );

  loadInterview$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadInterview),
      switchMap(() =>
        this.homeService.loadInterview().pipe(
          map((response: Interview[]) =>
            loadInterviewSuccess({ payload: response })
          ),
          catchError((error) => of(loadInterviewFail(error)))
        )
      )
    )
  );

  loadTestimonials$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadTestimonials),
      switchMap(() =>
        this.homeService.loadTestimonials().pipe(
          map((response: Testimonial[]) =>
            loadTestimonialsSuccess({ payload: response })
          ),
          catchError((error) => of(loadTestimonialsFail(error)))
        )
      )
    )
  );

  loadPartners$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadPartners),
      switchMap(() =>
        this.homeService.loadPartners().pipe(
          map((response: Partner[]) =>
            loadPartnersSuccess({ payload: response })
          ),
          catchError((error) => of(loadPartnersFail(error)))
        )
      )
    )
  );

  loadHomeSetting$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadHomeSetting),
      switchMap(() =>
        this.settingService.loadSetting().pipe(
          map((response: Setting) => loadHomeSettingSuccess(response)),
          catchError((error) => of(loadHomeSettingFail(error)))
        )
      )
    )
  );
}
