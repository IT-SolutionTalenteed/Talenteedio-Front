import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Article } from 'src/app/shared/models/article.interface';
import { Interview } from 'src/app/shared/models/interview.interface';
import { Setting } from 'src/app/shared/models/setting.interface';

@Component({
  selector: 'app-hr-media',
  templateUrl: './hr-media.component.html',
  styleUrls: ['./hr-media.component.scss'],
})
export class HrMediaComponent {
  @Input() articles: Article[];
  @Input() interview: Interview[];
  @Input() homeSettingLoading: boolean;
  private sanitizer = inject(DomSanitizer);
  content: SafeHtml;
  image: string;
  @Input() set homeSetting(value: Partial<Setting>) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(value?.voice ?? '');
    this.image = value?.homeImage3?.fileUrl ?? '/assets/img/hr-media-home.jpg';
  }
}
