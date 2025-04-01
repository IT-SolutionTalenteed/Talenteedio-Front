/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import * as moment from 'moment';
import { SubSink } from 'subsink';
import { PeriodFilter } from '../../types/period-filter.interface';

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => PeriodFilterComponent),
  multi: true,
};

@Component({
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.scss'],
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class PeriodFilterComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  form: UntypedFormGroup;

  @Output() filter: EventEmitter<PeriodFilter> =
    new EventEmitter<PeriodFilter>();
  @Input() clearable = true;
  @Input() fromLabel = 'Du';
  @Input() toLabel = 'Au';
  private subs = new SubSink();
  private item: PeriodFilter;
  private onChange: Function;
  private onTouched: Function;

  constructor(private formBuilder: UntypedFormBuilder) {
    /*  */
    this.onChange = (_: PeriodFilter) => {
      /*  */
    };
    this.onTouched = () => {
      /*  */
    };
  }

  @Input() set periodFilter(periodFilter: PeriodFilter) {
    periodFilter && (this.form = this.initForm(periodFilter));
    this.form &&
      (this.subs.sink = this.form.valueChanges.subscribe(
        this.onFormChanges.bind(this)
      ));
    this.form &&
      (this.subs.sink = this.form
        .get('beginDate')
        .valueChanges.subscribe(this.onBeginDateChange.bind(this)));
    this.form &&
      (this.subs.sink = this.form
        .get('endDate')
        .valueChanges.subscribe(this.onEndDateChange.bind(this)));
  }

  ngOnInit() {
    if (!this.form) {
      this.form = this.initForm(undefined);
      this.subs.sink = this.form.valueChanges.subscribe(
        this.onFormChanges.bind(this)
      );
      this.subs.sink = this.form
        .get('beginDate')
        .valueChanges.subscribe(this.onBeginDateChange.bind(this));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // control Value accessor implementation
  writeValue(obj: PeriodFilter): void {
    this.item = obj;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    /*  */
  }

  private onFormChanges() {
    setTimeout(() => {
      const { beginDate, endDate } = this.form.value;
      const periodFilter: PeriodFilter = {
        from: moment(new Date(`${beginDate}`))
          .startOf('day')
          .toDate(),
        to: moment(new Date(`${endDate}`))
          .endOf('day')
          .toDate(),
      };
      this.filter.emit({
        from: moment(periodFilter.from as Date).isValid()
          ? (periodFilter.from as Date).toISOString()
          : '',
        to: moment(periodFilter.to as Date).isValid()
          ? (periodFilter.to as Date).toISOString()
          : '',
      });
      this.onChange(periodFilter);
      this.item = periodFilter;
    });
  }

  private initForm(periodFilter: PeriodFilter) {
    return this.formBuilder.group({
      beginDate: [
        periodFilter
          ? moment(new Date(periodFilter.from)).format('YYYY-MM-DD')
          : null,
      ],
      endDate: [
        periodFilter
          ? moment(new Date(periodFilter.to)).format('YYYY-MM-DD')
          : null,
      ],
    });
  }

  private onBeginDateChange(beginDate: Date) {
    const endDate = this.form.get('endDate');
    beginDate &&
      (!moment(endDate.value).isValid() ||
        moment(endDate.value).isBefore(beginDate)) &&
      endDate.setValue(moment(beginDate).add(1, 'day').toDate());
  }

  private onEndDateChange(endDate: Date) {
    const beginDate = this.form.get('beginDate');
    endDate &&
      (!moment(beginDate.value).isValid() ||
        moment(beginDate.value).isAfter(endDate)) &&
      beginDate.setValue(moment(endDate).subtract(1, 'day').toDate());
  }
}
