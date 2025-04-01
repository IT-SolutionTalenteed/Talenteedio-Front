import { Component, Input } from '@angular/core';
import { Menu } from 'src/app/root/types/menu.interface';

@Component({
    selector: 'app-navbar-menu',
    templateUrl: './navbar-menu.component.html',
    styleUrls: ['./navbar-menu.component.scss'],
})
export class NavbarMenuComponent {
    @Input() menus: Menu[];
    @Input() currentUrl: string;
    showNavigationArrows: boolean;
}
