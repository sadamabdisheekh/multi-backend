import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { PaymentStatus } from './entities/payment-status.entity';
import { OrderStatus } from './entities/order-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Cart,
    CartItem,
    Order,
    OrderItem,
    PaymentMethod,
    PaymentStatus,
    OrderStatus
  ])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
