import {
  faChartBar,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { Menu } from '../types/menu.interface';

export const SIDE_NAV_MENU: Menu[] = [
  {
    title: 'Dashboard',
    icon: faChartBar,
    iconActive: faChartBar,
    routerLink: '/back-office/dashboard',
    accessRight: 'LOGGED',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  {
    title: 'Logout',
    icon: faSignOutAlt,
    iconActive: faSignOutAlt,
    routerLink: '/home',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
];
