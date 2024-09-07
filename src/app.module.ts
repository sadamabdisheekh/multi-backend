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
import { ItemsModule } from './items/items.module';
import { ItemsEntity } from './items/entities/item.entity';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/entities/store.entity';
import { StoreSchedule } from './stores/entities/store-schedule.entity';
import { ItemTypes } from './items/entities/item-type.entity';
import { SubCategoryEntity } from './category/entities/sub-category.entity';
import { ChildSubCategoryEntity } from './category/entities/child-sub-category.entity';
import { AttributeValue } from './items/entities/attribute-value.entity';
import { Attribute } from './items/entities/attribute.entity';
import { ItemVariationAttribute } from './items/entities/item-variation-attribute.entity';
import { ItemVariation } from './items/entities/item-variation.entity';
import { Brand } from './items/entities/brand.entity';


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
        ItemsEntity, Store,StoreSchedule, Attribute, AttributeValue, 
        ItemVariation, ItemVariationAttribute,ItemTypes,Brand
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ModulesModule,
    ZonesModule,
    ModuleZoneModule,
    CategoryModule,
    ItemsModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
