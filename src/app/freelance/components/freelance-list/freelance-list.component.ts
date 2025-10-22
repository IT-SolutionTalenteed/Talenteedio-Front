import { Component, Input } from '@angular/core';
import { Job } from 'src/app/shared/models/job.interface';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-freelance-list',
  templateUrl: './freelance-list.component.html',
  styleUrls: ['./freelance-list.component.scss'],
})
export class FreelanceListComponent {
  @Input() jobs: Job[];
  @Input() user: User;
}
