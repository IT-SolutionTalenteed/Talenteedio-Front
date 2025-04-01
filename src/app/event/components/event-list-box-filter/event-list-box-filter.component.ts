import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { EMPTY_EVENT_FILTER } from '../../constants/event.constant';
import { EventFilter } from '../../types/event-filter.interface';

@Component({
  selector: 'app-event-list-box-filter',
  templateUrl: './event-list-box-filter.component.html',
  styleUrls: ['./event-list-box-filter.component.scss'],
})
export class EventListBoxFilterComponent {
  @Output() saveFilter: EventEmitter<EventFilter> =
    new EventEmitter<EventFilter>();

  faSearch = faSearch;

  form = this.initForm(EMPTY_EVENT_FILTER);
  constructor(private formBuilder: FormBuilder) {}
  onSubmit(form: FormGroup) {
    this.saveFilter.emit(form.value);
  }

  private initForm(filter: EventFilter): FormGroup {
    return this.formBuilder.group({
      search: [filter.search],
    });
  }
}
