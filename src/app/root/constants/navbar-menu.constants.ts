import { Menu } from '../types/menu.interface';

export const NAVAR_MENUS: Menu[] = [
  {
    title: 'Home',
    routerLink: '/home',
    parentRouterLink: '/home',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  {
    title: 'Jobs',
    routerLink: '/job',
    parentRouterLink: '/job',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  {
    title: 'Missions',
    routerLink: '/freelance',
    parentRouterLink: '/freelance',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  {
    title: 'Voice',
    routerLink: '/voice',
    parentRouterLink: '/voice',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  // {
  //   title: 'Initiative',
  //   routerLink: '/initiative',
  //   accessRight: 'ALL',
  //   color: '#696969',
  //   colorActive: '#6bbee3',
  // },
  // {
  //   title: 'HR Society',
  //   routerLink: '/community',
  //   accessRight: 'ALL',
  //   color: '#696969',
  //   colorActive: '#6bbee3',
  // },
];
