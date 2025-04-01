import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-did-you-know',
  templateUrl: './did-you-know.component.html',
  styleUrls: ['./did-you-know.component.scss'],
})
export class DidYouKnowComponent {
  private sanitizer = inject(DomSanitizer);
  content: SafeHtml;
  @Input() set didYouKnow(value: string) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(value ?? '');
  }
}
