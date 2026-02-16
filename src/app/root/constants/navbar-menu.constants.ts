import { Menu } from '../types/menu.interface';
import { RoleName } from 'src/app/shared/models/role.interface';

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
    title: 'Annonces',
    routerLink: '/job',
    parentRouterLink: '/job',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
    megaMenu: true,
    subMenus: [
      {
        title: 'Offres d\'emploi',
        routerLink: '/job',
        icon: 'briefcase',
        description: 'Plus de 1000 opportunités à saisir !'
      },
      {
        title: 'Missions Freelance',
        routerLink: '/freelance',
        icon: 'laptop',
        description: 'Trouvez votre prochaine mission'
      },
      {
        title: 'Recherchez une entreprise',
        routerLink: '/companies',
        icon: 'building',
        description: 'Suivez et découvrez les entreprises'
      },
    ]
  },
  {
    title: 'Événements',
    routerLink: '/event',
    parentRouterLink: '/event',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
    megaMenu: true,
    subMenus: [
      {
        title: 'Tous nos événements',
        routerLink: '/event/list',
        icon: 'calendar',
        description: 'Participez aux événements RH'
      }
    ]
  },
  {
    title: 'Articles',
    routerLink: '/blog',
    parentRouterLink: '/blog',
    accessRight: 'ALL',
    color: '#696969',
    colorActive: '#6bbee3',
  },
  {
    title: 'Matching Profile',
    routerLink: '/matching-profile',
    parentRouterLink: '/matching-profile',
    accessRight: [RoleName.TALENT],
    color: '#696969',
    colorActive: '#6bbee3',
  },
];
