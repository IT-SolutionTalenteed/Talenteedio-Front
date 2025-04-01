import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  faBriefcase,
  faCheck,
  faLocationDot,
  faSearch,
  faStarHalfStroke,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import { Category, JobType } from 'src/app/shared/models/job.interface';
import { LocationJob } from 'src/app/shared/models/location-job.interface';
import { User } from 'src/app/shared/models/user.interface';
import {
  DATE_POSTED_FILTER,
  EMPTY_JOB_FILTER,
  EXPERIENCE_LEVEL_FILTER,
} from '../../constants/job-list.constant';
import { JobFilter } from '../../types/job-filter.interface';

@Component({
  selector: 'app-job-list-box-filter',
  templateUrl: './job-list-box-filter.component.html',
  styleUrls: ['./job-list-box-filter.component.scss'],
})
export class JobListBoxFilterComponent {
  @Output() saveFilter: EventEmitter<JobFilter> = new EventEmitter<JobFilter>();
  @Input() locations: LocationJob[];
  @Input() user: User;

  faSearch = faSearch;
  faMapMarker = faLocationDot;
  faTasks = faTasks;
  faStarHalf = faStarHalfStroke;
  faCheck = faCheck;
  fabriefcase = faBriefcase;

  @Input() jobTypes: JobType[];

  @Input() categories: Category[];

  experienceLevels = EXPERIENCE_LEVEL_FILTER;

  datePeriods = DATE_POSTED_FILTER;

  form = this.initForm(EMPTY_JOB_FILTER);

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(form: FormGroup) {
    this.saveFilter.emit(form.value);
  }

  @Input() set jobFilter(jobFilter: JobFilter) {
    if (jobFilter) {
      this.form = this.initForm(jobFilter);
    }
  }

  private initForm(filter: JobFilter): FormGroup {
    return this.formBuilder.group({
      search: [filter.search],
      location: [filter.location],
      jobTypes: [filter.jobTypes],
      datePosted: [filter.datePosted],
      experienceLevels: [filter.experienceLevels],
      category: [filter.category],
      isFeatured: [filter.isFeatured],
    });
  }
}
