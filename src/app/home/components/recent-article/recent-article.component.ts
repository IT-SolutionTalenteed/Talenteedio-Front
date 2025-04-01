import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Setting } from 'src/app/shared/models/setting.interface';

@Component({
  selector: 'app-recent-article',
  templateUrl: './recent-article.component.html',
  styleUrls: ['./recent-article.component.scss'],
})
export class RecentArticleComponent {
  @Input() homeSettingLoading: boolean;
  private sanitizer = inject(DomSanitizer);
  content: SafeHtml;
  @Input() set homeSetting(value: Partial<Setting>) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(
      value?.initiative ?? ''
    );
  }
}
