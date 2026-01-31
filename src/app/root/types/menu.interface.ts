import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { RoleName } from 'src/app/shared/models/role.interface';

export interface SubMenu {
  title: string;
  routerLink: string;
  icon?: string;
  description?: string;
}

export interface Menu {
  title: string;
  icon?: IconDefinition;
  iconActive?: IconDefinition;
  routerLink?: string;
  parentRouterLink?: string;
  children?: Menu[];
  accessRight?: RoleName[] | 'ALL' | 'LOGGED';
  color?: string;
  colorActive: string;
  megaMenu?: boolean;
  subMenus?: SubMenu[];
}
