import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Tab } from './entities/tab.entity';
import { TabPermission } from './entities/tab-permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(Menu) 
    private menuRepository: Repository<Menu>
  ) {}

  async getMenusByRole(payload: any) {
    let query = this.menuRepository.createQueryBuilder('menu')
      .select([
        'menu.path', 'menu.title', 'menu.iconType', 'menu.icon', 'menu.class',
        'menu.groupTitle', 'menu.badge', 'menu.badgeClass',
        'tab.path', 'tab.title', 'tab.iconType', 'tab.icon', 'tab.class',
        'tab.groupTitle', 'tab.badge', 'tab.badgeClass'
      ])
      .innerJoinAndSelect('menu.tabs', 'tab')
      .innerJoin('tab.tabPermissions', 'tp')
      .innerJoin('tp.permission', 'p');
  
    if (payload.roleId) {
      query.innerJoin('p.rolePermissions', 'rp')
           .innerJoin('rp.role', 'r')
           .where('r.roleId = :roleId', { roleId: payload.roleId });
    } else if (payload.userId) {
      query.innerJoin('p.userPermissions', 'up')
           .innerJoin('up.user', 'u')
           .where('u.userId = :userId', { userId: payload.userId });
    }
  
    const menus = await query.getMany();
  
    return menus.map(({ tabs, ...menu }) => ({
      ...menu,
      badge: menu.badge ?? '',
      badgeClass: menu.badgeClass ?? '',
      icon: menu.icon ?? '',
      iconType: menu.iconType ?? '',
      submenu: tabs.map(tab => ({
        ...tab,
        badge: tab.badge ?? '',
        badgeClass: tab.badgeClass ?? '',
        icon: tab.icon ?? '',
        iconType: tab.iconType ?? '',
        submenu: []
      }))
    }));
  }

  async getMenusWithPermission(user: any): Promise<any> {
    const { userId, userRole } = user;
    const query = this.menuRepository.createQueryBuilder('menus')
    .innerJoinAndSelect('menus.tabs', 'T')
    .innerJoinAndSelect('T.tabPermissions', 'TP')
    .innerJoinAndSelect('TP.permission', 'p');
    if(userRole && userRole.role.roleId){ 
      query.innerJoinAndSelect('p.rolePermissions', 'rp')
      .innerJoinAndSelect('rp.role', 'r')
      .where('r.roleId = :roleId', { roleId: userRole.role.roleId })
    }else{
      query.innerJoinAndSelect('p.userPermissions', 'up')
      .innerJoinAndSelect('up.user', 'u')
      .where('u.userId = :userId', { userId })
    }
    return query.getMany();

  }
  

  
  
}
