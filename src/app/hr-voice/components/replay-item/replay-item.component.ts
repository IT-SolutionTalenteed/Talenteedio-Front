import { Component, Input } from '@angular/core';
import { Interview } from 'src/app/shared/models/interview.interface';

@Component({
  selector: 'app-replay-item',
  templateUrl: './replay-item.component.html',
  styleUrls: ['./replay-item.component.scss'],
})
export class ReplayItemComponent {
  @Input() replay: Partial<Interview>;
}
