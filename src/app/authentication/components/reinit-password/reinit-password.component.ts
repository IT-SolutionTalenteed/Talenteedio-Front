import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';

@Component({
  selector: 'app-reinit-password',
  templateUrl: './reinit-password.component.html',
  styleUrls: ['./reinit-password.component.scss'],
})
export class ReinitPasswordComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  containerHeight: number;
  notContainerHeight: number;
  @Output() send: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('first', { static: false }) firstInput: ElementRef;

  constructor(private formBuilder: FormBuilder) {
    /** */
  }

  ngOnInit() {
    this.form = this.initForm();
    this.notContainerHeight = 120;
    if (typeof window !== 'undefined') {
      window.innerWidth <= 768
        ? (this.containerHeight = window.innerHeight - this.notContainerHeight)
        : (this.containerHeight = 772 - 30 * 2);
    }
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
    });
  }

  showErrors() {
    markFormAsTouchedAndDirty(this.form);
  }
}
