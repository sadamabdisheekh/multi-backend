import { Module } from '@nestjs/common';
import { ModuleZoneService } from './module-zone.service';
import { ModuleZoneController } from './module-zone.controller';
import { ModuleZoneEntity } from './module-zone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleZoneEntity])],
  controllers: [ModuleZoneController],
  providers: [ModuleZoneService],
})
export class ModuleZoneModule { }
