import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from 'src/order/entities/order_statuses.entity';
import { PaymentStatus } from 'src/order/entities/payment_statuses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus,PaymentStatus])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
