import { Component, Input } from '@angular/core';
import { Interview } from 'src/app/shared/models/interview.interface';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss'],
})
export class InterviewListComponent {
  @Input() interviews: Interview[];
}
