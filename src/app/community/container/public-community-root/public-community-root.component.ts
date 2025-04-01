import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Setting } from 'src/app/shared/models/setting.interface';

@Component({
  selector: 'app-public-community-root',
  templateUrl: './public-community-root.component.html',
  styleUrls: ['./public-community-root.component.scss'],
})
export class PublicCommunityRootComponent {
  @Input() homeSettingLoading: boolean;
  private sanitizer = inject(DomSanitizer);
  content: SafeHtml;
  @Input() set homeSetting(value: Partial<Setting>) {
    this.content = value?.initiative
      ? this.sanitizer.bypassSecurityTrustHtml(value.initiative)
      : undefined;
  }
}
