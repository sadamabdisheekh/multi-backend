import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserRoles } from 'src/access-control/entities/user_roles.entity';
import { UserPermission } from 'src/access-control/entities/user-permission.entity';
import { Permission } from 'src/access-control/entities/permission.entity';
import { RolePermission } from 'src/access-control/entities/role-permission.entity';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,UserProfile,Store,UserRoles,UserPermission,Permission,RolePermission])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
