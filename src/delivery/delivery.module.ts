import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryType } from './entities/delivery-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryType
    ])
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
