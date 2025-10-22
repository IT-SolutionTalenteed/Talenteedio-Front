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
  EMPTY_FREELANCE_FILTER,
  EXPERIENCE_LEVEL_FILTER,
} from '../../constants/freelance-list.constant';
import { FreelanceFilter } from '../../types/freelance-filter.interface';

@Component({
  selector: 'app-freelance-list-box-filter',
  templateUrl: './freelance-list-box-filter.component.html',
  styleUrls: ['./freelance-list-box-filter.component.scss'],
})
export class FreelanceListBoxFilterComponent {
  @Output() saveFilter: EventEmitter<FreelanceFilter> = new EventEmitter<FreelanceFilter>();
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

  form = this.initForm(EMPTY_FREELANCE_FILTER);

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(form: FormGroup) {
    this.saveFilter.emit(form.value);
  }

  @Input() set freelanceFilter(freelanceFilter: FreelanceFilter) {
    if (freelanceFilter) {
      this.form = this.initForm(freelanceFilter);
    }
  }

  private initForm(filter: FreelanceFilter): FormGroup {
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
