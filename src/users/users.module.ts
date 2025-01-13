import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { Store } from 'src/stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,UserProfile,Store])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
