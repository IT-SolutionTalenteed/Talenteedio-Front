import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header-dark',
  templateUrl: './page-header-dark.component.html',
  styleUrls: ['./page-header-dark.component.scss']
})
export class PageHeaderDarkComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() breadcrumbs: { label: string; link?: string }[] = [];
  @Input() backgroundImage: string = '/assets/img/backgrounds/Hero22.png';
  @Input() showAnimatedLines: boolean = true;
}
