import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { environment } from 'src/environments/environment';
import { Credentials } from '../../types/credentials.interface';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  @ViewChild('first', { static: false }) firstInput: ElementRef;
  @ViewChild('password') passwordEl: ElementRef;
  @Output() signIn: EventEmitter<Credentials> = new EventEmitter<Credentials>();
  @Input() loginErrorMessage: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set emailError(value: any) {
    if (value) {
      this.captchaElem.resetCaptcha();
    }
  }

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

  callbackQueryParam: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private gaService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.form = this.initForm();
    this.callbackQueryParam = this.route.snapshot.queryParamMap.get('callback');
  }
  ngAfterViewInit() {
    this.setFocusOnFirstInput();
  }
  private setFocusOnFirstInput() {
    this.firstInput.nativeElement.focus();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
      recaptcha: [undefined, Validators.required],
    });
  }

  showErrors() {
    markFormAsTouchedAndDirty(this.form);
  }

  onSubmit(form: FormGroup) {
    form.valid ? this.signIn.emit(form.value) : this.showErrors();
  }

  showPassword() {
    this.passwordEl.nativeElement.type =
      this.passwordEl.nativeElement.type === 'password' ? 'text' : 'password';
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
}
