/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Menu } from 'src/app/root/types/menu.interface';

const MENU_ITEM_HOVER_CLASS = 'menu__item--hover';
const MENU_ITEM_ACTIVE_CLASS = 'menu__item--active';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnChanges {
  @Input() menu: Menu;
  @Input() active: boolean;
  @Input() isSmallScreen: boolean;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('menuItem', { static: true }) menuItem: ElementRef;
  @ViewChild('submenu', { static: true }) submenu: ElementRef;

  // tslint:disable-next-line: no-duplicate-string
  @HostListener('click', ['$event.target']) onMouseClick(menuItem) {
    !this.isSmallScreen &&
      this.hasClass(this.menuItem, MENU_ITEM_HOVER_CLASS) &&
      this.removeClass(this.menuItem, MENU_ITEM_HOVER_CLASS);
  }

  @HostListener('mouseenter', ['$event.target']) onMouseEnter(menuItem) {
    !this.active && this.addClass(this.menuItem, MENU_ITEM_HOVER_CLASS);
  }

  @HostListener('mouseleave', ['$event.target']) onMouseLeave(menuItem) {
    this.hasClass(this.menuItem, MENU_ITEM_HOVER_CLASS) &&
      this.removeClass(this.menuItem, MENU_ITEM_HOVER_CLASS);
  }

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.isSmallScreen &&
      this.hasClass(this.menuItem, MENU_ITEM_ACTIVE_CLASS)
    ) {
      setTimeout(() => {
        this.removeClass(this.menuItem, MENU_ITEM_ACTIVE_CLASS);
        this.toggle.emit();
      });
    }
    if (!this.isSmallScreen && this.active) {
      setTimeout(() => {
        this.addClass(this.menuItem, MENU_ITEM_ACTIVE_CLASS);
      });
    }
  }

  hasClass(element: ElementRef, className: string) {
    return element.nativeElement.classList.contains(className);
  }

  addClass(element: ElementRef, className: string) {
    this.renderer.addClass(element.nativeElement, className);
  }

  removeClass(element: ElementRef, className: string) {
    this.renderer.removeClass(element.nativeElement, className);
  }

  toggleClass(element: ElementRef, className: string) {
    this.hasClass(element, className)
      ? this.removeClass(element, className)
      : this.addClass(element, className);
  }
}
