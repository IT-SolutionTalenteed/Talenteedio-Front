import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployerService } from '../../services/employer.service';

@Component({
  selector: 'app-employer-jobs',
  templateUrl: './employer-jobs.component.html',
  styleUrls: ['./employer-jobs.component.scss'],
})
export class EmployerJobsComponent {
  form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    content: ['', Validators.required],
    expirationDate: ['', Validators.required],
  });

  creating = false;
  createdMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private employer: EmployerService) {}

  create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.creating = true;
    this.createdMsg = '';
    this.errorMsg = '';

    this.employer.createJob(this.form.value as any).subscribe({
      next: () => {
        this.createdMsg = 'Offre créée';
        this.creating = false;
        this.form.reset();
      },
      error: (e) => {
        this.errorMsg = e?.error?.msg || 'Erreur';
        this.creating = false;
      },
    });
  }
}

