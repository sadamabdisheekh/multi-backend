import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import {  UserStore } from './user-store.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserType } from './user-types.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity,UserStore,Store,UserType
  ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
