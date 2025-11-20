import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
})
export class ContactModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ name: string; email: string; phone: string }>();

  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submit.emit(this.contactForm.value);
    }
  }
}
