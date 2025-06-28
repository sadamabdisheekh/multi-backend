import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/order/entities/order_statuses.entity';
import { PaymentStatus } from 'src/order/entities/payment_statuses.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(PaymentStatus)
    private readonly paymentStatusRepository: Repository<PaymentStatus>,
  ) {}

  async seed() {
    await this.saveOrderStatus();
    await this.savePaymentStatus();
  }

  async saveOrderStatus() {
    await this.orderStatusRepository.save([
      { id: 1, name: 'Pending', isFinal: false, description: 'Order has been placed but not yet confirmed.' },
      { id: 2, name: 'Confirmed', isFinal: false, description: 'Order has been confirmed by the store.' },
      { id: 3, name: 'Processing', isFinal: false, description: 'Order is currently being prepared or packed.' },
      { id: 4, name: 'Shipped', isFinal: false, description: 'Order has been shipped to the customer.' },
      { id: 5, name: 'Delivered', isFinal: true, description: 'Order has been successfully delivered.' },
      { id: 6, name: 'Cancelled', isFinal: true, description: 'Order was cancelled before shipping.' },
      { id: 7, name: 'Returned', isFinal: true, description: 'Order was returned by the customer.' },
      { id: 8, name: 'Failed', isFinal: true, description: 'Delivery or processing of the order failed.' },
    ]);
  }

  async savePaymentStatus() {
    await this.paymentStatusRepository.save([
      { id: 1, name: 'Pending', isFinal: false, description: 'Payment has not been received yet.' },
      { id: 2, name: 'Paid', isFinal: true, description: 'Payment was successfully completed.' },
      { id: 3, name: 'Failed', isFinal: true, description: 'Payment attempt was unsuccessful.' },
    ]);
    
  }

 
}
