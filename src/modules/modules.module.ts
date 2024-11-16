import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { ModuleEntity } from './module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from 'common/UploadService';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
  controllers: [ModulesController],
  providers: [ModulesService,UploadService],
})
export class ModulesModule { }
