import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import {  UserStore } from './user-store.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserType } from './user-types.entity';
import { UserRoles } from 'src/access-control/entities/user_roles.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity,UserStore,Store,UserType,UserRoles
  ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
