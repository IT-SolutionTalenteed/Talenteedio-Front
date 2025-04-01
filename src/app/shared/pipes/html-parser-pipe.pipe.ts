import { Inject, PLATFORM_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlParser',
})
export class HtmlParserPipePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  transform(richText: string): string {
    if (typeof window !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(richText, 'text/html');
      return doc.body.textContent || '';
    } else {
      // Return the original richText value during SSR
      return richText;
    }
  }
}
