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
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/entities/store.entity';
import { StoreSchedule } from './stores/entities/store-schedule.entity';
import { SubCategoryEntity } from './category/entities/sub-category.entity';
import { ChildSubCategoryEntity } from './category/entities/child-sub-category.entity';
import { ItemModule } from './item/item.module';
import { Brand } from './item/entities/brand.entity';
import { ItemTypes } from './item/entities/itemType.entity';
import { Item } from './item/entities/item.entity';
import { Attribute } from './item/entities/attribute.entity';
import { AttributeValue } from './item/entities/attributeValue.entity';
import { ItemVariation } from './item/entities/itemVariation.entity';
import { ItemVariationAttributes } from './item/entities/itemVariationAttributes.entity';


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
        UserEntity, ModuleEntity, ZoneEntity, ModuleZoneEntity,
        CategoryEntity, SubCategoryEntity, ChildSubCategoryEntity,
        Store,StoreSchedule,ItemTypes,Brand,Item,Attribute,AttributeValue,
        ItemVariation,ItemVariationAttributes
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ModulesModule,
    ZonesModule,
    ModuleZoneModule,
    CategoryModule,
    StoresModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
