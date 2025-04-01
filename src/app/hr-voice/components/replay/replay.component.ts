import { Component, Input } from '@angular/core';
import { Interview } from 'src/app/shared/models/interview.interface';

@Component({
  selector: 'app-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss'],
})
export class ReplayComponent {
  @Input() replay: Partial<Interview>[];
}
