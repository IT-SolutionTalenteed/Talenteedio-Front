import { Component, Input } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Event } from 'src/app/shared/models/event.interface';

@Component({
  selector: 'app-community-events',
  templateUrl: './community-events.component.html',
  styleUrls: ['./community-events.component.scss'],
})
export class CommunityEventsComponent {
  events: Partial<Event>[];
  @Input() set eventsInput(_events: Partial<Event>[]) {
    this.events = _events.slice(0, 3);
  }
  readMoreIcon = faChevronRight;
}
