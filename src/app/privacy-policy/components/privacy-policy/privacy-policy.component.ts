import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnChanges {
  @Input() privacy: string;
  content: SafeHtml;
  constructor(private sanitizer: DomSanitizer) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['privacy']) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(this.privacy ?? '');
    }
  }
}
