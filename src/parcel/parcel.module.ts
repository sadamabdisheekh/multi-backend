import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelTypes } from './entities/parcel-type.entity';
import { ParcelService } from './parcel.service';
import { ParcelController } from './parcel.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParcelTypes
    ])
  ],
  controllers: [ParcelController],
  providers: [ParcelService],
})
export class ParcelModule {}
