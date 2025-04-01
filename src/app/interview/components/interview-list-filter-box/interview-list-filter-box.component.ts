import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { EMPTY_INTERVIEW_FILTER } from '../../constants/interview.constant';
import { InterviewFilter } from '../../types/interview-filter.interface';

@Component({
  selector: 'app-interview-list-filter-box',
  templateUrl: './interview-list-filter-box.component.html',
  styleUrls: ['./interview-list-filter-box.component.scss'],
})
export class InterviewListFilterBoxComponent {
  @Output() saveFilter: EventEmitter<InterviewFilter> =
    new EventEmitter<InterviewFilter>();

  faSearch = faSearch;

  form = this.initForm(EMPTY_INTERVIEW_FILTER);
  constructor(private formBuilder: FormBuilder) {}
  onSubmit(form: FormGroup) {
    this.saveFilter.emit(form.value);
  }

  private initForm(filter: InterviewFilter): FormGroup {
    return this.formBuilder.group({
      search: [filter.search],
    });
  }
}
