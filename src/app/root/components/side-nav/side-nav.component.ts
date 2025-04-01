import { Component, Input } from '@angular/core';
import { Menu } from '../../types/menu.interface';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  @Input() menus: Menu[] = [];

  isDesktop = true;
  collapsed = false;
  desktopWidth = 1290;

  toggle() {
    this.isDesktop = !this.isDesktop;
    this.collapsed = !this.collapsed;
  }
}
