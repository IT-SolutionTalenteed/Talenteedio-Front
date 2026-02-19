import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Company } from 'src/app/shared/models/company.interface';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { LocationJob } from 'src/app/shared/models/location-job.interface';
import { User } from 'src/app/shared/models/user.interface';
import { SharedState } from 'src/app/shared/store/reducers/shared.reducers';
import { getLocations } from 'src/app/shared/store/selectors/shared.selectors';
import { SubSink } from 'subsink';
import { loadJobs } from '../../store/actions/job-list.actions';
import { JobListState } from '../../store/reducers/job-list.reducers';
import {
  getCompanies,
  getCompaniesLoading,
  getDidYouKnow,
  getJobCategories,
  getJobListCriteria,
  getJobTypes,
  getJobs,
  getJobsLoading,
  getJobsTotalItems,
} from '../../store/selectors/job-list.selectors';
import { JobFilter } from '../../types/job-filter.interface';
import { JobListCriteria } from '../../types/job-list-criteria.interface';

@Component({
  selector: 'app-job-list-root',
  templateUrl: './job-list-root.component.html',
  styleUrls: ['./job-list-root.component.scss'],
})
export class JobListRootComponent implements OnInit, OnDestroy {
  jobs$: Observable<Job[]>;
  jobTypes$: Observable<JobType[]>;
  categories$: Observable<Category[]>;
  jobsLoading$: Observable<boolean>;
  totalItems$: Observable<number>;
  locations$: Observable<LocationJob[]>;
  jobListCriteria: JobListCriteria;
  private subs = new SubSink();
  jobLength: number;
  user$: Observable<User>;
  companies$: Observable<Company[]>;
  companiesLoading$: Observable<boolean>;
  didYouKnow$: Observable<string | null>;

  constructor(
    private jobListStore: Store<JobListState>,
    private sharedStore: Store<SharedState>,
    private authenticationStore: Store<AuthenticationState>
  ) {}

  ngOnInit(): void {
    this.totalItems$ = this.jobListStore.pipe(select(getJobsTotalItems));
    this.jobs$ = this.jobListStore.pipe(select(getJobs));
    // Filtrer les jobTypes pour exclure "Freelance" et autres types non désirés
    this.jobTypes$ = this.jobListStore.pipe(
      select(getJobTypes),
      map((jobTypes) => jobTypes.filter((jobType) => jobType.name !== 'Freelance'))
    );
    this.categories$ = this.jobListStore.pipe(select(getJobCategories));
    this.jobs$.subscribe((jobs) => (this.jobLength = jobs.length));
    this.jobsLoading$ = this.jobListStore.pipe(select(getJobsLoading));
    this.user$ = this.authenticationStore.pipe(select(getLoggedUser));
    this.subs.sink = this.jobListStore
      .pipe(select(getJobListCriteria))
      .subscribe((criteria) => (this.jobListCriteria = cloneDeep(criteria)));
    this.locations$ = this.sharedStore.pipe(select(getLocations));
    this.companies$ = this.jobListStore.pipe(select(getCompanies));
    this.companiesLoading$ = this.jobListStore.pipe(
      select(getCompaniesLoading)
    );
    this.didYouKnow$ = this.jobListStore.pipe(select(getDidYouKnow));
  }

  onFilter(filter: JobFilter) {
    this.jobListCriteria.filter = filter;
    this.jobListStore.dispatch(
      loadJobs({
        ...this.jobListCriteria,
        page: { ...this.jobListCriteria.page, page: 1 },
      })
    );
  }
  onPaginate(page) {
    this.jobListCriteria.page = page;
    this.jobListStore.dispatch(loadJobs(this.jobListCriteria));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
