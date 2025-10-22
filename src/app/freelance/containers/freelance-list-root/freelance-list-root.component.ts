import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Company } from 'src/app/shared/models/company.interface';
import { Category, Job, JobType } from 'src/app/shared/models/job.interface';
import { LocationJob } from 'src/app/shared/models/location-job.interface';
import { User } from 'src/app/shared/models/user.interface';
import { SharedState } from 'src/app/shared/store/reducers/shared.reducers';
import { getLocations } from 'src/app/shared/store/selectors/shared.selectors';
import { SubSink } from 'subsink';
import { loadFreelanceJobs } from '../../store/actions/freelance-list.actions';
import { FreelanceListState } from '../../store/reducers/freelance-list.reducers';
import {
  getCompanies,
  getCompaniesLoading,
  getDidYouKnow,
  getJobCategories,
  getFreelanceListCriteria,
  getJobTypes,
  getFreelanceJobs,
  getFreelanceJobsLoading,
  getFreelanceJobsTotalItems,
} from '../../store/selectors/freelance-list.selectors';
import { FreelanceFilter } from '../../types/freelance-filter.interface';
import { FreelanceListCriteria } from '../../types/freelance-list-criteria.interface';

@Component({
  selector: 'app-freelance-list-root',
  templateUrl: './freelance-list-root.component.html',
  styleUrls: ['./freelance-list-root.component.scss'],
})
export class FreelanceListRootComponent implements OnInit, OnDestroy {
  jobs$: Observable<Job[]>;
  jobTypes$: Observable<JobType[]>;
  categories$: Observable<Category[]>;
  jobsLoading$: Observable<boolean>;
  totalItems$: Observable<number>;
  locations$: Observable<LocationJob[]>;
  freelanceListCriteria: FreelanceListCriteria;
  private subs = new SubSink();
  jobLength: number;
  user$: Observable<User>;
  companies$: Observable<Company[]>;
  companiesLoading$: Observable<boolean>;
  didYouKnow$: Observable<string | null>;

  constructor(
    private freelanceListStore: Store<FreelanceListState>,
    private sharedStore: Store<SharedState>,
    private authenticationStore: Store<AuthenticationState>
  ) {}

  ngOnInit(): void {
    this.totalItems$ = this.freelanceListStore.pipe(select(getFreelanceJobsTotalItems));
    this.jobs$ = this.freelanceListStore.pipe(select(getFreelanceJobs));
    this.jobTypes$ = this.freelanceListStore.pipe(select(getJobTypes));
    this.categories$ = this.freelanceListStore.pipe(select(getJobCategories));
    this.jobs$.subscribe((jobs) => (this.jobLength = jobs.length));
    this.jobsLoading$ = this.freelanceListStore.pipe(select(getFreelanceJobsLoading));
    this.user$ = this.authenticationStore.pipe(select(getLoggedUser));
    this.subs.sink = this.freelanceListStore
      .pipe(select(getFreelanceListCriteria))
      .subscribe((criteria) => (this.freelanceListCriteria = cloneDeep(criteria)));
    this.locations$ = this.sharedStore.pipe(select(getLocations));
    this.companies$ = this.freelanceListStore.pipe(select(getCompanies));
    this.companiesLoading$ = this.freelanceListStore.pipe(
      select(getCompaniesLoading)
    );
    this.didYouKnow$ = this.freelanceListStore.pipe(select(getDidYouKnow));
  }

  onFilter(filter: FreelanceFilter) {
    this.freelanceListCriteria.filter = filter;
    this.freelanceListStore.dispatch(
      loadFreelanceJobs({
        ...this.freelanceListCriteria,
        page: { ...this.freelanceListCriteria.page, page: 1 },
      })
    );
  }
  
  onPaginate(page) {
    this.freelanceListCriteria.page = page;
    this.freelanceListStore.dispatch(loadFreelanceJobs(this.freelanceListCriteria));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
