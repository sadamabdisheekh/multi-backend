import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import {  UserStore } from './user-store.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserType } from './user-types.entity';
import { UserRoles } from 'src/access-control/entities/user_roles.entity';
import { Role } from 'src/access-control/entities/role.entity';
import { UserPermission } from 'src/access-control/entities/user-permission.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity,UserStore,Store,UserType,UserRoles,Role,UserPermission
  ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
