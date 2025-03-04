import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import { ZonesModule } from './zones/zones.module';
import { ModuleZoneModule } from './module-zone/module-zone.module';
import { MulterModule } from '@nestjs/platform-express';
import { StoresModule } from './stores/stores.module';
import { ItemModule } from './item/item.module';
import { CartModule } from './cart/cart.module';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule.register({
      dest: './uploads', // Destination folder for uploaded files
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
      })
    }),
    UsersModule,
    AuthModule,
    ModulesModule,
    ZonesModule,
    ModuleZoneModule,
    StoresModule,
    ItemModule,
    CartModule,
    CustomersModule,
    OrderModule,
    ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule { }
