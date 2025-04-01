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
import { ReCaptcha2Component } from 'ngx-captcha-ssr';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { environment } from 'src/environments/environment';
import { EMPTY_EMAIL } from '../../constants/contact.constant';
import { ContactEmail } from '../../types/contact-email.interface';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  @Output() send: EventEmitter<ContactEmail> = new EventEmitter<ContactEmail>();
  @ViewChild('first', { static: false }) firstInput: ElementRef;
  @Input() set emailSent(sent: boolean) {
    if (sent) {
      this.form = this.initForm(EMPTY_EMAIL);
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

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  private initForm(contact: ContactEmail): FormGroup {
    return this.formBuilder.group({
      email: [
        contact.email,
        Validators.compose([Validators.required, Validators.email]),
      ],
      name: [contact.name, Validators.required],
      subject: [contact.subject, Validators.required],
      message: [contact.message, Validators.required],
      recaptcha: [undefined, Validators.required],
    });
  }

  private setFocusOnFirstInput() {
    this.firstInput.nativeElement.focus();
  }

  ngOnInit() {
    if (!this.form) {
      this.form = this.initForm(EMPTY_EMAIL);
    }
  }
  ngAfterViewInit() {
    this.setFocusOnFirstInput();
  }
  private showErrors() {
    markFormAsTouchedAndDirty(this.form);
  }
  onSubmit(form: FormGroup) {
    const user = form.value as ContactEmail;
    this.form.valid ? this.send.emit(user) : this.showErrors();
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
