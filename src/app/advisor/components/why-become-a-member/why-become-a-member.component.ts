import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-why-become-a-member',
  templateUrl: './why-become-a-member.component.html',
  styleUrls: ['./why-become-a-member.component.scss'],
})
export class WhyBecomeAMemberComponent {
  @Input() totalJobs: number;
  @Input() totalUsers: number;
  @Input() totalEvents: number;
}
