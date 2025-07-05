import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import { MulterModule } from '@nestjs/platform-express';
import { StoresModule } from './stores/stores.module';
import { ItemModule } from './item/item.module';
import { CartModule } from './cart/cart.module';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { AccessControlModule } from './access-control/access-control.module';
import { SeederModule } from './seeder/seeder.module';
import { AppDataSource } from 'db/data-source';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule.register({
      dest: './uploads', // Destination folder for uploaded files
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    AuthModule,
    ModulesModule,
    StoresModule,
    ItemModule,
    CartModule,
    CustomersModule,
    OrderModule,
    AccessControlModule,
    SeederModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
