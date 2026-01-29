import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JOB_LIST_BASE_ROUTE } from 'src/app/job-list/constants/job-list.constant';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { Article } from 'src/app/shared/models/article.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Job } from 'src/app/shared/models/job.interface';
import { LocationJob } from 'src/app/shared/models/location-job.interface';
import { Partner } from 'src/app/shared/models/partner.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { Testimonial } from 'src/app/shared/models/testimonial.interface';
import { SharedState } from 'src/app/shared/store/reducers/shared.reducers';
import { getLocations } from 'src/app/shared/store/selectors/shared.selectors';
import { HomeState } from '../../store/reducers/home.reducers';
import {
  getArticles,
  getArticlesLoading,
  getCompanies,
  getCompaniesLoading,
  getHomeSetting,
  getHomeSettingLoading,
  getInterview,
  getJobs,
  getJobsLoading,
  getPartners,
  getPartnersLoading,
  getTestimonials,
  getTestimonialsLoading,
} from '../../store/selectors/home.selectors';

@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.component.html',
  styleUrls: ['./home-root.component.scss'],
})
export class HomeRootComponent implements OnInit {
  locations$: Observable<LocationJob[]>;
  jobs$: Observable<Job[]>;
  jobsLoading$: Observable<boolean>;
  articles$: Observable<Article[]>;
  interview$: Observable<Interview[]>;
  articlesLoading$: Observable<boolean>;
  testimonials$: Observable<Testimonial[]>;
  testimonialsLoading$: Observable<boolean>;
  homeSetting$: Observable<Partial<Setting>>;
  homeSettingLoading$: Observable<boolean>;
  partners$: Observable<Partial<Partner>[]>;
  partnersLoading$: Observable<boolean>;
  companies$: Observable<Company[]>;
  companiesLoading$: Observable<boolean>;

  constructor(
    private sharedStore: Store<SharedState>,
    private homeStore: Store<HomeState>
  ) {}
  ngOnInit(): void {
    this.locations$ = this.sharedStore.pipe(select(getLocations));
    this.jobs$ = this.homeStore.pipe(select(getJobs));
    this.jobsLoading$ = this.homeStore.pipe(select(getJobsLoading));
    this.articles$ = this.homeStore.pipe(select(getArticles));
    this.interview$ = this.homeStore.pipe(select(getInterview));
    this.articlesLoading$ = this.homeStore.pipe(select(getArticlesLoading));
    this.testimonials$ = this.homeStore.pipe(select(getTestimonials));
    this.testimonialsLoading$ = this.homeStore.pipe(
      select(getTestimonialsLoading)
    );
    this.homeSetting$ = this.homeStore.pipe(select(getHomeSetting));
    this.homeSettingLoading$ = this.homeStore.pipe(
      select(getHomeSettingLoading)
    );
    this.partners$ = this.homeStore.pipe(select(getPartners));
    this.partnersLoading$ = this.homeStore.pipe(select(getPartnersLoading));
    this.companies$ = this.homeStore.pipe(select(getCompanies));
    this.companiesLoading$ = this.homeStore.pipe(select(getCompaniesLoading));
  }
  onFindJob(jobCriteria) {
    this.go([`${JOB_LIST_BASE_ROUTE}`], { ...jobCriteria });
  }
  private go(path: string[], queryParams) {
    this.sharedStore.dispatch(go({ path, query: queryParams }));
  }
}
