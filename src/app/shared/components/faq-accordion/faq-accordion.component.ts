import { Component, Input } from '@angular/core';

export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.scss']
})
export class FaqAccordionComponent {
  @Input() faqItems: FaqItem[] = [];
  @Input() title: string = 'Questions fréquentes';
  
  openIndex: number | null = null;

  toggleItem(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }
}
