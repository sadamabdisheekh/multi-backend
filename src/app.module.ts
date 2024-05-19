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
import { CategoryEntity } from './category/category.entity';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { SubCategoryEntity } from './sub-category/sub-category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChildSubCategoryModule } from './child-sub-category/child-sub-category.module';
import { ItemsModule } from './items/items.module';
import { ChildSubCategoryEntity } from './child-sub-category/entities/child-sub-category.entity';
import { ItemsEntity } from './items/entities/item.entity';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/entities/store.entity';


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
        CategoryEntity, SubCategoryEntity, ChildSubCategoryEntity, ItemsEntity,Store],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Specify the path to the uploads directory
      serveRoot: '/uploads', // Specify the base URL for serving static files
    }),
    UsersModule,
    AuthModule,
    ModulesModule,
    ZonesModule,
    ModuleZoneModule,
    CategoryModule,
    SubCategoryModule,
    ChildSubCategoryModule,
    ItemsModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
