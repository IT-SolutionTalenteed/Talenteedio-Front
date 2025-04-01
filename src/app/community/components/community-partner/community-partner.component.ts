import { Component } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-community-partner',
  templateUrl: './community-partner.component.html',
  styleUrls: ['./community-partner.component.scss'],
})
export class CommunityPartnerComponent {
  readMoreIcon = faChevronRight;
}
