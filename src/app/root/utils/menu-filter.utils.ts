import { Role } from 'src/app/shared/models/role.interface';
import { User } from 'src/app/shared/models/user.interface';
import { Menu } from '../types/menu.interface';

export const generateSideNavMenusDependingOnUserRights = (
  allMenus: Menu[],
  role: Role
): Menu[] => {
  const filteredMenus: Menu[] = [];
  const userRole = role;
  allMenus.forEach((menu: Menu) => {
    if (menu.children) {
      const filteredChildren: Menu[] = (menu.children || []).filter(
        ({ accessRight }) => accessRight.includes(userRole.name)
      );
      if (filteredChildren.length) {
        filteredMenus.push({
          ...menu,
          children: filteredChildren,
        });
      }
    } else if (menu.accessRight.includes(userRole.name)) {
      filteredMenus.push(menu);
    }
  });
  return filteredMenus;
};

// eslint-disable-next-line complexity
const userHasAccess = (menu: Menu, user?: User) => {
  if (menu.accessRight === 'ALL') {
    return true;
  }else
  if (menu.accessRight === 'LOGGED' && (!!user)) {
    return true;
  }else {
    return false;
  }
};

export const filterHeaderMenusDependingOnUserRight = (
  allMenus: Menu[],
  user?: User
): Menu[] => allMenus.filter((menu) => userHasAccess(menu, user));
