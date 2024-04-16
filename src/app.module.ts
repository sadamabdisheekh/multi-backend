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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mypassword',
      database: 'multi',
      entities: [UserEntity, ModuleEntity, ZoneEntity, ModuleZoneEntity, CategoryEntity, SubCategoryEntity],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ModulesModule,
    ZonesModule,
    ModuleZoneModule,
    CategoryModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
