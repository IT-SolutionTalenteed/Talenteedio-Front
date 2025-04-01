import { Component, Input } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Event } from 'src/app/shared/models/event.interface';
@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
})
export class EventItemComponent {
  @Input() event: Event;
  readMoreIcon = faChevronRight;
}
