import { Menu } from 'src/app/root/types/menu.interface';
import { Role } from '../models/role.interface';

export const getFirstAccessibleMenu = (role: Role, menus: Menu[]): Menu => {
    const menuList = menus.filter(menu => menu.accessRight);
    menus
        .filter(menu => menu.children)
        .forEach(menu => menu.children.forEach(submenu => menuList.push(submenu)));
    return menuList.find(menu => menu.accessRight.includes(role.type));
};
