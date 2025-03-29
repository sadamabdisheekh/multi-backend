import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserPermission } from './user-permission.entity';
import { TabPermission } from './tab-permission.entity';
import { RolePermission } from './role-permission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  permissionId: number;

  @Column()
  permission: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @OneToMany(() => TabPermission, tabPermission => tabPermission.permission)
  tabPermissions: TabPermission[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserPermission, userPermission => userPermission.permission)
  userPermissions: UserPermission[];
}