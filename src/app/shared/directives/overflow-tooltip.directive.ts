import { AfterContentChecked, Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appOverflowTooltip]'
})
export class OverflowTooltipDirective implements AfterContentChecked {
    constructor(private el: ElementRef) { }

    ngAfterContentChecked() {
        Array.from(this.el.nativeElement.querySelectorAll('td, th')).map(it => it as HTMLElement).forEach(
            (element: HTMLElement) => {
                this.isEllipsisActive(element)
                    ? (element.title = element.innerText)
                    : element.removeAttribute('title');
            }
        );
    }

    private isEllipsisActive(element: HTMLElement) {
        return element.offsetWidth < element.scrollWidth;
    }
}
