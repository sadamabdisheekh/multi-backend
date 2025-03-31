import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerUser } from './entities/customer-users.entity';
import { UserEntity } from 'src/users/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Customer,
      CustomerUser,
      UserEntity
    ]),
    AuthModule
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
