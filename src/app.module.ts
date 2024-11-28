import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import { ModuleEntity } from './modules/module.entity';
import { ZonesModule } from './zones/zones.module';
import { ModuleZoneModule } from './module-zone/module-zone.module';
import { ZoneEntity } from './zones/zone.entity';
import { ModuleZoneEntity } from './module-zone/module-zone.entity';

import { MulterModule } from '@nestjs/platform-express';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/entities/store.entity';
import { StoreSchedule } from './stores/entities/store-schedule.entity';
import { ItemModule } from './item/item.module';
import { Brand } from './item/entities/brand.entity';
import { ItemTypes } from './item/entities/item-type.entity';
import { Item } from './item/entities/item.entity';
import { Attribute } from './item/entities/attribute.entity';
import { AttributeValue } from './item/entities/attribute-value.entity';
import { ItemVariation } from './item/entities/item-variation.entity';
import { Category } from './item/entities/category.entity';
import { ItemVariationAttribute } from './item/entities/item-variation-attribute.entity';
import { StoreItem } from './stores/entities/store-item.entity';
import { UserProfile } from './users/user-profile.entity';
import { ItemUnit } from './item/entities/item-unit.entity';
import { ItemImage } from './item/entities/item-images';


@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Destination folder for uploaded files
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'mypassword',
      database: 'multi',
      entities: [
        UserEntity,UserProfile, ModuleEntity, ZoneEntity, ModuleZoneEntity,
        Store,StoreItem,StoreSchedule,ItemTypes,ItemUnit,ItemImage,Brand,Item,Attribute,AttributeValue,
        ItemVariation,ItemVariationAttribute,Category
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ModulesModule,
    ZonesModule,
    ModuleZoneModule,
    StoresModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule { }
