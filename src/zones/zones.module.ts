import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { ZoneEntity } from './zone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ZoneEntity])],
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule { }
