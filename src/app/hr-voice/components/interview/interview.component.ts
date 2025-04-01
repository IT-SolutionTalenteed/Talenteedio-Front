import { Component, Input } from '@angular/core';
import { Interview } from 'src/app/shared/models/interview.interface';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss'],
})
export class InterviewComponent {
  @Input() interview: Interview[];
}
