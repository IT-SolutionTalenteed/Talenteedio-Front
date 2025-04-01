import { Component, Input } from '@angular/core';
import { Interview } from 'src/app/shared/models/interview.interface';

@Component({
  selector: 'app-interview-item',
  templateUrl: './interview-item.component.html',
  styleUrls: ['./interview-item.component.scss'],
})
export class InterviewItemComponent {
  @Input() replay: Partial<Interview>;
}
