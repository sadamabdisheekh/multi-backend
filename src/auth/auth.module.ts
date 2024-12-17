import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserJwtStrategy } from './strategies/user-jwt.strategy';
import { CustomerJwtStrategy } from './strategies/customer-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SHARED_JWT_SECRET'), 
      }),
    }),
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService,UserJwtStrategy, CustomerJwtStrategy],
})
export class AuthModule { }
