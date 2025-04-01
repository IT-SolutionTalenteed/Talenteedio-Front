import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { PHONE_CONFIG } from 'src/app/authentication/constants/authentication.constant';
import { EventService } from 'src/app/event/services/event.service';
import { EventListCriteria } from 'src/app/event/types/event-list-criteria.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { environment } from 'src/environments/environment';
import { JOIN_US_EMPTY_FORM } from '../../constants/join-us.constant';
import { JoinUsForm } from '../../types/join-us-form.interface';

@Component({
  selector: 'app-join-us-from',
  templateUrl: './join-us-from.component.html',
  styleUrls: ['./join-us-from.component.scss'],
  providers: [EventService],
})
export class JoinUsFromComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public eventService: EventService
  ) {}
  eventCriteria: EventListCriteria = {
    filter: {
      search: null,
    },
    page: {
      page: 1,
      pageSize: 20,
    },
    sort: {
      by: 'title',
      direction: SortDirection.asc,
    },
  };
  isEventsLoading = false;

  events = [];
  config = PHONE_CONFIG;
  form: FormGroup;
  @Output() send: EventEmitter<JoinUsForm & { recaptcha: string }> =
    new EventEmitter<JoinUsForm & { recaptcha: string }>();

  // captcha variables
  isWindowLoaded = typeof window !== 'undefined';
  public readonly siteKey = environment.siteKey;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public useGlobalDomain = false;

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  ngOnInit() {
    if (!this.form) {
      this.form = this.initForm(JOIN_US_EMPTY_FORM);
    }
  }

  initForm(joinUsForm: JoinUsForm) {
    return this.formBuilder.group({
      socialReason: [joinUsForm.socialReason, Validators.required],
      address: [joinUsForm.address, Validators.required],
      firstName: [joinUsForm.firstName, Validators.required],
      lastName: [joinUsForm.lastName, Validators.required],
      professionalEmail: [
        joinUsForm.professionalEmail,
        Validators.compose([Validators.required, Validators.email]),
      ],
      role: [joinUsForm.role, Validators.required],
      phone: [joinUsForm.phone, Validators.required],
      motivation: [joinUsForm.motivation, Validators.required],
      events: [joinUsForm.events],
      otherTopics: [joinUsForm.otherTopics],
      recaptcha: [undefined, Validators.required],
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.send.emit(form.value);
    } else {
      this.showErrors();
    }
  }

  private showErrors() {
    markFormAsTouchedAndDirty(this.form);
  }

  // captcha method

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }

  onSearchEvents(term: string) {
    this.isEventsLoading = true;
    this.eventCriteria = {
      ...this.eventCriteria,
      page: {
        ...this.eventCriteria.page,
        page: 1,
      },
      filter: {
        search: term,
      },
    };
    this.eventService
      .loadEvents(this.eventCriteria)
      .subscribe((suggestionsData) => {
        this.isEventsLoading = false;
        const suggestions = suggestionsData.items?.filter(
          (suggestion) => suggestion
        );
        this.events = suggestions;
      });
  }

  onLoadMore() {
    this.isEventsLoading = true;
    this.eventCriteria = {
      ...this.eventCriteria,
      page: {
        ...this.eventCriteria.page,
        page: this.eventCriteria.page.page + 1,
      },
    };
    this.eventService
      .loadEvents(this.eventCriteria)
      .subscribe((suggestionsData) => {
        this.isEventsLoading = false;
        const suggestions = suggestionsData.items?.filter(
          (suggestion) => suggestion
        );
        this.events = [...this.events, ...suggestions];
      });
  }

  onShowDropdown() {
    this.isEventsLoading = true;
    this.eventCriteria = {
      ...this.eventCriteria,
      filter: {
        search: null,
      },
      page: {
        ...this.eventCriteria.page,
        page: 1,
      },
    };
    this.eventService
      .loadEvents(this.eventCriteria)
      .subscribe((suggestionsData) => {
        this.isEventsLoading = false;
        const suggestions = suggestionsData.items?.filter(
          (suggestion) => suggestion
        );
        this.events = suggestions;
      });
  }
}
