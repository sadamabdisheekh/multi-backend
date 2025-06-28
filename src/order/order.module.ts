import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order_items.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { PaymentStatus } from './entities/payment_statuses.entity';
import { OrderStatus } from './entities/order_statuses.entity';

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
