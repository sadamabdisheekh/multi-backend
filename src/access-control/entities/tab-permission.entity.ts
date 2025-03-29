import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tab } from './tab.entity';
import { Permission } from './permission.entity';

@Entity('tab_permissions')
export class TabPermission {
  @PrimaryGeneratedColumn()
  tabPermissionId: number;

  @ManyToOne(() => Tab, tab => tab.tabPermissions)
  @JoinColumn({ name: 'tabId' })
  tab: Tab;

  @ManyToOne(() => Permission, permission => permission.tabPermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}