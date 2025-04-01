import { Component, Input } from '@angular/core';
import { Job } from 'src/app/shared/models/job.interface';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent {
  @Input() jobs: Job[];
  @Input() user: User;
}
