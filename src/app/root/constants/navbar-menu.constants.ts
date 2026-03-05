import { Menu } from '../types/menu.interface';
import { RoleName } from 'src/app/shared/models/role.interface';

export const NAVAR_MENUS: Menu[] = [
  {
    title: 'header.menu.home',
    routerLink: '/home',
    parentRouterLink: '/home',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  {
    title: 'header.menu.jobs',
    routerLink: '/job',
    parentRouterLink: '/job',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
    megaMenu: true,
    subMenus: [
      {
        title: 'header.megaMenu.jobs.allJobs',
        routerLink: '/job',
        icon: 'briefcase',
        description: 'header.megaMenu.jobs.allJobsDesc'
      },
      {
        title: 'header.megaMenu.jobs.companies',
        routerLink: '/companies',
        icon: 'building',
        description: 'header.megaMenu.jobs.companiesDesc'
      },
    ]
  },
  {
    title: 'header.menu.events',
    routerLink: '/event',
    parentRouterLink: '/event',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
    megaMenu: true,
    subMenus: [
      {
        title: 'header.megaMenu.events.allEvents',
        routerLink: '/event/list',
        icon: 'calendar',
        description: 'header.megaMenu.events.allEventsDesc'
      }
    ]
  },
  {
    title: 'header.menu.articles',
    routerLink: '/blog',
    parentRouterLink: '/blog',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  {
    title: 'header.menu.matchingProfile',
    routerLink: '/matching-profile',
    parentRouterLink: '/matching-profile',
    accessRight: [RoleName.TALENT],
    color: '#696969',
    colorActive: '#6bbee3',
  },
];
