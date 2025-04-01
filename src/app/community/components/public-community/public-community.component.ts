import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-public-community',
  templateUrl: './public-community.component.html',
  styleUrls: ['./public-community.component.scss'],
})
export class PublicCommunityComponent {
  @Input() content: SafeHtml;
}
