import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { ZoneEntity } from 'src/zones/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store,ZoneEntity])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
