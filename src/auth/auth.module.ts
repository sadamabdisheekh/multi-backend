import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { UserStore } from 'src/users/user-store.entity';
import { UserRoles } from 'src/access-control/entities/user_roles.entity';
import { UserPermission } from 'src/access-control/entities/user-permission.entity';
import { Permission } from 'src/access-control/entities/permission.entity';
import { RolePermission } from 'src/access-control/entities/role-permission.entity';
import { UserType } from 'src/users/user-types.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserStore, UserRoles, UserPermission, Permission, RolePermission, UserType]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: process.env.JWT_EXPIRY },
    }),
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule { }
