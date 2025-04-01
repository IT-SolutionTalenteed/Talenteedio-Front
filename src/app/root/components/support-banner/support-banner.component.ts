import { Component } from '@angular/core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-support-banner',
  templateUrl: './support-banner.component.html',
  styleUrls: ['./support-banner.component.scss'],
})
export class SupportBannerComponent {
  collapseIcon = faChevronDown;
  isCollapsed = false;

  onCollapse() {
    this.collapseIcon =
      this.collapseIcon === faChevronDown ? faChevronUp : faChevronDown;
    this.isCollapsed = !this.isCollapsed;
  }
}
