/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnDestroy {
  @ContentChild('modalHeader') header: TemplateRef<any>;
  @ContentChild('modalBody') body: TemplateRef<any>;
  @ContentChild('modalFooter') footer: TemplateRef<any>;
  @Input() closeOnOutsideClick = true;
  closing = new Subject<any>();

  visible = false;
  visibleAnimate = false;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnDestroy() {
    this.close();
  }

  open(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   document.body.classList.add('modal-open');
    // }

    this.visible = true;
    setTimeout(() => {
      this.visibleAnimate = true;
    });
  }

  close(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   document.body.classList.remove('modal-open');
    // }

    this.visibleAnimate = false;
    setTimeout(() => {
      this.visible = false;
      this.changeDetectorRef.markForCheck();
      this.closing.next('closing');
    }, 200);
  }

  @HostListener('click', ['$event'])
  onContainerClicked(event: MouseEvent): void {
    if (
      (event.target as HTMLElement).classList.contains('modal') &&
      this.isTopMost() &&
      this.closeOnOutsideClick
    ) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isTopMost()) {
      this.close();
    }
  }

  isTopMost(): boolean {
    return !this.elementRef.nativeElement.querySelector(
      ':scope modal > .modal'
    );
  }
}
