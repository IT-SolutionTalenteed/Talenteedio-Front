import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { faClipboardList, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  PHONE_CONFIG,
  SIGN_IN_ROUTE,
} from 'src/app/authentication/constants/authentication.constant';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';
import { go } from 'src/app/routeur/store/actions/router.actions';
import { JobFormService } from '../../services/job-form.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Job } from 'src/app/shared/models/job.interface';
import { UserDocument } from 'src/app/shared/models/user-document';
import { User } from 'src/app/shared/models/user.interface';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { SubSink } from 'subsink';
import { applyForJob, referJob } from '../../store/actions/job-form.actions';
import { JobFormState } from '../../store/reducers/job-form.reducers';
import {
  getApplyForJobErrorMessage,
  getApplyForJobLoading,
  getCVs,
  getJob,
  getJobLoading,
  getLMs,
  getReferJobErrorMessage,
  getReferJobLoading,
} from '../../store/selectors/job-form.selectors';
@Component({
  selector: 'app-job-form-root',
  templateUrl: './job-form-root.component.html',
  styleUrls: ['./job-form-root.component.scss'],
})
export class JobFormRootComponent implements OnInit, AfterViewInit {
  jobLoading$: Observable<boolean>;
  job$: Observable<Job>;
  user$: Observable<User>;
  job: Job;
  referalLink: string;
  CVs: UserDocument[];
  LMs: UserDocument[];
  jobId: string;
  applyForJobLoading$: Observable<boolean>;
  applyForJobError$: Observable<string>;
  referJobLoading$: Observable<boolean>;
  referJobError$: Observable<string>;
  isClient = false;
  showMatchScore = false;
  matchPercentage = 0;
  matchLoading = false;
  matchError = '';
  clipBoardIcon = faClipboardList;
  faUserPlus = faUserPlus;
  config = PHONE_CONFIG;

  private sub = new SubSink();
  @ViewChild('applyJobModal') applyJobModal: ModalComponent;
  @ViewChild('referJobModal') referJobModal: ModalComponent;
  @ViewChild('matchJobModal') matchJobModal: ModalComponent;

  form = this.initForm({ lmId: undefined, cvId: undefined });
  referForm = this.initReferForm({
    talentEmail: undefined,
    talentFullName: undefined,
    talentNumber: undefined,
  });
  matchForm = this.initMatchForm({ cvId: undefined });

  // eslint-disable-next-line max-params
  constructor(
    private jobFormStore: Store<JobFormState>,
    private authenticationStore: Store<AuthenticationState>,
    private router: Router,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private location: Location,
    private titleService: Title,
    private jobFormService: JobFormService
  ) {}

  ngOnInit(): void {
    this.jobLoading$ = this.jobFormStore.pipe(select(getJobLoading));
    this.job$ = this.jobFormStore.pipe(select(getJob));
    this.user$ = this.authenticationStore.pipe(select(getLoggedUser));
    this.sub.sink = this.job$.subscribe((job) => {
      this.referalLink = job?.referralLink;
      this.job = job;
      if (job) {
        this.titleService.setTitle(`${job.title} | Talenteed`);
        this.initMeta();
      }
    });
    this.initUrlParam();
    this.initApplyParams();
    this.initReferParams();
  }
  ngAfterViewInit(): void {
    this.subscribeCloseModal();
  }
  subscribeCloseModal() {
    this.applyJobModal?.closing.subscribe(
      (message) =>
        (this.form = this.initForm({ lmId: undefined, cvId: undefined }))
    );
    this.referJobModal?.closing.subscribe(
      (message) =>
        (this.referForm = this.initReferForm({
          talentEmail: undefined,
          talentFullName: undefined,
          talentNumber: undefined,
        }))
    );
    this.matchJobModal?.closing.subscribe(
      (message) => {
        this.matchForm = this.initMatchForm({ cvId: undefined });
        this.showMatchScore = false;
      }
    );
  }
  initReferParams() {
    this.referJobLoading$ = this.jobFormStore.pipe(select(getReferJobLoading));
    this.referJobError$ = this.jobFormStore.pipe(
      select(getReferJobErrorMessage)
    );
  }
  initApplyParams() {
    this.sub.sink = this.jobFormStore
      .pipe(select(getCVs))
      .subscribe((Cvs) => (this.CVs = Cvs));
    this.sub.sink = this.jobFormStore
      .pipe(select(getLMs))
      .subscribe((LMs) => (this.LMs = LMs));
    this.applyForJobLoading$ = this.jobFormStore.pipe(
      select(getApplyForJobLoading)
    );
    this.applyForJobError$ = this.jobFormStore.pipe(
      select(getApplyForJobErrorMessage)
    );
  }
  initUrlParam() {
    const url = this.router.url;
    const urlTree = this.router.parseUrl(url);
    this.jobId = urlTree.root.children['primary'].segments[2].path;
  }
  onApplyForJob(form) {
    this.form.valid
      ? this.jobFormStore.dispatch(
          applyForJob({ ...form.value, jobId: this.jobId })
        )
      : this.showErrors();
  }
  onApply() {
    this.applyJobModal.open();
  }

  onLogin() {
    this.go([SIGN_IN_ROUTE], { redirect: this.router.url });
  }

  onRefer() {
    this.referJobModal.open();
  }

  onMatch() {
    this.showMatchScore = false;
    this.matchJobModal.open();
  }

  onValidateMatch(matchForm) {
    if (this.matchForm.valid) {
      this.matchLoading = true;
      this.matchError = '';
      
      // Call the AI matching service
      this.jobFormService.matchCVWithJob(
        matchForm.value.cvId,
        this.job.id  // Use job.id instead of jobId (which is the slug)
      ).subscribe({
        next: (response: any) => {
          this.matchLoading = false;
          this.matchPercentage = response.data.matchCVWithJob.overall_match_percentage;
          this.showMatchScore = true;
        },
        error: (error) => {
          this.matchLoading = false;
          this.matchError = error.message || 'Failed to calculate match score';
          console.error('Match error:', error);
        }
      });
    } else {
      this.showMatchErrors();
    }
  }

  closeMatchModal() {
    this.matchJobModal.close();
    this.showMatchScore = false;
    this.matchPercentage = 0;
    this.matchError = '';
    this.matchForm = this.initMatchForm({ cvId: undefined });
  }
  onReferJob(referForm) {
    this.referForm.valid
      ? this.jobFormStore.dispatch(
          referJob({
            ...referForm.value,
            job: this.job,
            jobReferenceLink: this.job.referralLink,
            talentNumber: referForm.value.talentNumber?.internationalNumber,
          })
        )
      : this.showReferErrors();
  }

  private go(path: string[], query: { redirect: string }) {
    this.jobFormStore.dispatch(go({ path, query }));
  }

  private initForm(form: {
    cvId: UserDocument;
    lmId: UserDocument;
  }): FormGroup {
    return this.formBuilder.group({
      cvId: [form.cvId, Validators.required],
      lmId: [form.lmId],
    });
  }

  private initReferForm(form: {
    talentEmail: string;
    talentNumber: string;
    talentFullName: string;
  }): FormGroup {
    return this.formBuilder.group({
      talentEmail: [form.talentEmail, [Validators.required, Validators.email]],
      talentFullName: [form.talentFullName, Validators.required],
      talentNumber: [form.talentNumber],
    });
  }

  private initMatchForm(form: { cvId: UserDocument }): FormGroup {
    return this.formBuilder.group({
      cvId: [form.cvId, Validators.required],
    });
  }
  ngOnDestory() {
    this.sub.unsubscribe();
  }

  initMeta() {
    this.initFacebookMeta();
    this.initTwitterMeta();
    this.initPinterestMeta();
    this.initLinkedInMeta();
  }
  initFacebookMeta() {
    // facebook
    this.meta.addTag({ property: 'og:title', content: this.job.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.job.metaDescription ?? '',
    });
    this.meta.addTag({
      property: 'og:image',
      content: '/assets/img/thumb.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: this.location.prepareExternalUrl(this.location.path()),
    });
    this.meta.addTag({
      property: 'og:type',
      content: 'website',
    });
  }
  initLinkedInMeta() {
    // LinkedIn
    this.meta.addTag({ property: 'og:title', content: this.job.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.job.metaDescription ?? '',
    });
    this.meta.addTag({
      property: 'og:image',
      content: this.job?.featuredImage?.fileUrl ?? '/assets/img/thumb.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: this.location.prepareExternalUrl(this.location.path()),
    });
    this.meta.addTag({
      property: 'og:type',
      content: 'website',
    });
    this.meta.addTag({
      property: 'og:site_name',
      content: 'Talenteed.io',
    });
  }
  initTwitterMeta() {
    this.meta.addTag({
      property: 'twitter:title',
      content: this.job.title,
    });
    this.meta.addTag({
      property: 'twitter:description',
      content: this.job.metaDescription ?? '',
    });
    this.meta.addTag({
      property: 'twitter:image',
      content: this.job?.featuredImage?.fileUrl ?? '/assets/img/thumb.jpg',
    });
  }
  initPinterestMeta() {
    this.meta.addTag({
      property: 'pinterest-rich-pin',
      content: 'true',
    });
  }
  showErrors() {
    markFormAsTouchedAndDirty(this.form);
  }
  showReferErrors() {
    markFormAsTouchedAndDirty(this.referForm);
  }

  showMatchErrors() {
    markFormAsTouchedAndDirty(this.matchForm);
  }
}
