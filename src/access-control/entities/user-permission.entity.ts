import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { UserEntity } from 'src/users/user.entity';

@Entity('user_permissions')
export class UserPermission {

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'permission_id' })
  permissionId: number;

  @ManyToOne(() => UserEntity, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => Permission, (permission) => permission.userPermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}