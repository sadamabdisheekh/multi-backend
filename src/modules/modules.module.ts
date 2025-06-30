import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { ModuleEntity } from './entities/module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from 'common/UploadService';
import { ZoneEntity } from './entities/zone.entity';
import { ModuleCategory } from './entities/module-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity,ZoneEntity,ModuleCategory])],
  controllers: [ModulesController],
  providers: [ModulesService,UploadService],
})
export class ModulesModule { }
