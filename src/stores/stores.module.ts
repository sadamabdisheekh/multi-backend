import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreSchedule } from './entities/store-schedule.entity';
import { UploadService } from 'common/UploadService';
import { ZoneEntity } from 'src/modules/entities/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreSchedule,Store,ZoneEntity])],
  controllers: [StoresController],
  providers: [StoresService,UploadService],
})
export class StoresModule {}
