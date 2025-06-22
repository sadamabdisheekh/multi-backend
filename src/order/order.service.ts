import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PaymentMethod } from './entities/payment-method.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './entities/order-status.entity';
import { Order } from './entities/order.entity';
import { PaymentStatus } from './entities/payment-status.entity';
import { SearchOrdersDto } from './dto/search_order.Dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(PaymentStatus)
    private paymentStatusRepository: Repository<PaymentStatus>,
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
    private readonly dataSource: DataSource
  ) {}

  async createOrder1(customerId: number, payload: any): Promise<Order> {
    try {

      const paymentStatus = await this.paymentStatusRepository.findOne({
        where: { name: 'Unpaid' },
      });
      const orderStatus = await this.orderStatusRepository.findOne({
        where: { name: 'Pending' },
      });
      const paymentMethod = await this.paymentMethodRepository.findOne({
        where: { id: payload.paymentMethodId },
      });
  
      if (!paymentStatus || !orderStatus || !paymentMethod) {
        throw new NotAcceptableException('Required entities for order creation are missing.');
      }
  
      const cart = await this.cartRepository.findOne({
        where: { user: { userId: customerId } },
        relations: ['customer'],
      });
  
      if (!cart) {
        throw new Error('Cart does not exist for the specified customer.');
      }
  

      const cartItems = await this.cartItemRepository.find({
        where: { cart: { id: cart.id } },
        relations: ['storeItem'],
      });
  
      if (!cartItems.length) {
        throw new Error('Cart is empty.');
      }
  
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
  
      const order = this.orderRepository.create({
        customer: { id: customerId },
        paymentMethod,
        paymentStatus,
        orderStatus,
        totalAmount,
      });

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0'); // Ensure 2-digit day
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
      const year = String(now.getFullYear()); // Full year 
  
      const savedOrder = await this.orderRepository.save(order);

      const orderCode = `${day}${month}${year}${savedOrder.id}`;

      savedOrder.orderCode = orderCode;

      await this.orderRepository.save(savedOrder); // Save the updated order
  
      const orderItems = cartItems.map(item =>
        this.orderItemRepository.create({
          storeItem: item.storeItem,
          quantity: item.quantity,
          price: item.price,
          order: savedOrder,
        }),
      );
  
      await this.orderItemRepository.save(orderItems);
  
      await this.cartItemRepository.delete({ cart: { id: cart.id } });
      await this.cartRepository.delete({ id: cart.id });
  
      return savedOrder;
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error occurred while creating order:', error.message);
  
      // Rethrow the error to be handled by the caller
      throw new Error(`Order creation failed: ${error.message}`);
    }
  }

  async createOrder(customerId: number, payload: any): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const paymentStatus = await this.paymentStatusRepository.findOne({
        where: { name: 'Unpaid' },
      });
      const orderStatus = await this.orderStatusRepository.findOne({
        where: { name: 'Pending' },
      });
      const paymentMethod = await this.paymentMethodRepository.findOne({
        where: { id: payload.paymentMethodId },
      });
  
      if (!paymentStatus || !orderStatus || !paymentMethod) {
        throw new NotAcceptableException(
          'Required entities for order creation are missing.',
        );
      }
  
      const cart = await this.cartRepository.findOne({
        where: { user: { userId: customerId } },
        relations: ['customer'],
      });
  
      if (!cart) {
        throw new Error('Cart does not exist for the specified customer.');
      }
  
      const cartItems = await this.cartItemRepository.find({
        where: { cart: { id: cart.id } },
        relations: ['storeItem'],
      });
  
      if (!cartItems.length) {
        throw new Error('Cart is empty.');
      }
  
      // Validate stock for all items before creating the order
      for (const item of cartItems) {
        const storeItem = item.storeItem;
        const quantityOrdered = item.quantity;
  
        // if (storeItem.availableStock < quantityOrdered) {
        //   throw new Error(
        //     `Insufficient stock for item ${storeItem.item.name}. Available: ${storeItem.stock}, Required: ${quantityOrdered}`,
        //   );
        // }
      }
  
      // Calculate total amount
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
  
      // Create the order
      const order = this.orderRepository.create({
        customer: { id: customerId },
        paymentMethod,
        paymentStatus,
        orderStatus,
        totalAmount,
        orderDate: new Date(),
      });
  
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear());
      const savedOrder = await queryRunner.manager.save(order);
  
      const orderCode = `${day}${month}${year}${savedOrder.id}`;
      savedOrder.orderCode = orderCode;
      await queryRunner.manager.save(savedOrder);
  
      const orderItems = cartItems.map(item =>
        this.orderItemRepository.create({
          storeItem: item.storeItem,
          quantity: item.quantity,
          price: item.price,
          order: savedOrder,
        }),
      );
  
      await queryRunner.manager.save(orderItems);
  
      // Deduct stock for all items
      for (const item of orderItems) {
        const storeItem = item.storeItem;
        // storeItem.availableStock -= item.quantity;
        await queryRunner.manager.save(storeItem);
      }
  
      // Clear the cart
      await queryRunner.manager.delete(this.cartItemRepository.target, {
        cart: { cart_id: cart.id },
      });
      await queryRunner.manager.delete(this.cartRepository.target, {
        cart_id: cart.id,
      });
  
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error occurred while creating order:', error.message);
      throw new Error(`Order creation failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
  

  async findPaymentMethods()  {
    return await this.paymentMethodRepository.find({
      where: {status: true}
    })
  }

  async findPaymentStatuses() {
    return await this.paymentStatusRepository.find();
  }

  async findOrderStatuses() {
    return await this.orderStatusRepository.find();
  }

  async searchOrders(payload: SearchOrdersDto) {
    const { storeId, orderStatusId, paymentStatusId, date } = payload;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .innerJoinAndSelect('order.customer', 'customer')
      .innerJoinAndSelect('order.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.storeItem', 'storeItem')
      .innerJoinAndSelect('storeItem.store', 'store')
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentStatus', 'paymentStatus');

    queryBuilder.andWhere('DATE(order.orderDate) = :date', { date: new Date(date) });
    // queryBuilder.andWhere('order.orderDate = :date', { date: new Date(date) });

    if (storeId) {
      queryBuilder.andWhere('store.id = :storeId', { storeId });
    }

    if (orderStatusId) {
      queryBuilder.andWhere('orderStatus.id = :orderStatusId', { orderStatusId });
    }

    if (paymentStatusId) {
      queryBuilder.andWhere('paymentStatus.id = :paymentStatusId', { paymentStatusId });
    }

    return await queryBuilder.getMany();
  }
}
