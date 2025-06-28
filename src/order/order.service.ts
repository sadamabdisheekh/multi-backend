import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PaymentMethod } from './entities/payment-method.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderItem } from './entities/order_items.entity';
import { OrderStatus } from './entities/order_statuses.entity';
import { Order } from './entities/orders.entity';
import { PaymentStatus } from './entities/payment_statuses.entity';
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
        user: { userId: customerId },
        store: {id: 1},
        paymentMethod,
        paymentStatus,
        orderStatus,
        totalPrice: totalAmount,
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

  async createOrder2(userId: number, payload: any): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const paymentStatus = await this.paymentStatusRepository.findOne({
        where: { name: 'Pending' },
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
        where: { user: { userId: userId },store: {id: payload.storeId} },
        relations: ['user','store'],
      });
  
      if (!cart) {
        throw new Error('Cart does not exist for the specified customer.');
      }
  
      const cartItems = await this.cartItemRepository.find({
        where: { cart: { id: cart.id } },
        relations: ['storeItem.item','storeItemVariation'],
      });
  
      if (!cartItems.length) {
        throw new Error('Cart is empty.');
      }
  
      // Validate stock for all items before creating the order
      for (const item of cartItems) {
        let availableStock = 0;
        if (item.storeItemVariation) {
          availableStock = item.storeItemVariation.availableStock ?? 0;
        }else {
          availableStock = item.storeItem.availableStock ?? 0;
        }
        const quantityOrdered = item.quantity;
  
        if (availableStock < quantityOrdered) {
          throw new Error(
            `Insufficient stock for item ${item.storeItem.item.name}. Available: ${availableStock}, Required: ${quantityOrdered}`,
          );
        }
      }
  
      // Calculate total amount
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
  
      // Create the order
      const order = this.orderRepository.create({
        user: { userId: userId },
        store: {id: cart.store.id},
        paymentMethod,
        paymentStatus,
        orderStatus,
        totalPrice,
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
          subtotal: item.price * item.quantity
        }),
      );
  
      await queryRunner.manager.save(orderItems);
  
      // Deduct stock for all items
      for (const item of cartItems) {
        if (item.storeItemVariation) {
          item.storeItemVariation.availableStock -= item.quantity;
          await queryRunner.manager.save(item.storeItemVariation);
        }else {
          item.storeItem.availableStock -= item.quantity;
          await queryRunner.manager.save(item.storeItem);
        }
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

  async createOrder(userId: number, payload: any): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      // Step 1: Fetch required statuses and method
      const [paymentStatus, orderStatus, paymentMethod] = await Promise.all([
        this.paymentStatusRepository.findOne({ where: { name: 'Pending' } }),
        this.orderStatusRepository.findOne({ where: { name: 'Pending' } }),
        this.paymentMethodRepository.findOne({ where: { id: payload.paymentMethodId } }),
      ]);
  
      if (!paymentStatus || !orderStatus || !paymentMethod) {
        throw new NotAcceptableException('Required status or payment method missing.');
      }
  
      // Step 2: Fetch cart and items
      const cart = await this.cartRepository.findOne({
        where: { user: { userId }, store: { id: payload.storeId } },
        relations: ['user', 'store'],
      });
  
      if (!cart) throw new Error('Cart not found for this user and store.');
  
      const cartItems = await this.cartItemRepository.find({
        where: { cart: { id: cart.id } },
        relations: ['storeItem.item', 'storeItemVariation'],
      });
  
      if (!cartItems.length) throw new Error('Cart is empty.');
  
      // Step 3: Stock validation
      for (const item of cartItems) {
        const stock = item.storeItemVariation?.availableStock ?? item.storeItem?.availableStock ?? 0;
        if (stock < item.quantity) {
          throw new Error(`Insufficient stock for item "${item.storeItem.item.name}". Available: ${stock}, Required: ${item.quantity}`);
        }
      }
  
      // Step 4: Calculate total
      const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      // Step 5: Create order
      const order = this.orderRepository.create({
        user: { userId },
        store: { id: cart.store.id },
        paymentMethod,
        paymentStatus,
        orderStatus,
        totalPrice,
      });
  
      const savedOrder = await queryRunner.manager.save(order);
  
      // Generate and save order code (e.g. 19062025123)
      const now = new Date();
      savedOrder.orderCode = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${now.getFullYear()}${savedOrder.id}`;
      await queryRunner.manager.save(savedOrder);
  
      // Step 6: Create order items
      const orderItems = cartItems.map((item) =>
        this.orderItemRepository.create({
          storeItem: item.storeItem,
          quantity: item.quantity,
          price: item.price,
          order: savedOrder,
          subtotal: item.price * item.quantity,
          storeItemVariation: item.storeItemVariation ?? null
        }),
      );
      await queryRunner.manager.save(orderItems);
  
      // Step 7: Deduct stock
      for (const item of cartItems) {
        if (item.storeItemVariation) {
          item.storeItemVariation.availableStock = Math.max((item.storeItemVariation.availableStock ?? 0) - item.quantity, 0);
          await queryRunner.manager.save(item.storeItemVariation);
        } else {
          item.storeItem.availableStock = Math.max((item.storeItem.availableStock ?? 0) - item.quantity, 0);
          await queryRunner.manager.save(item.storeItem);
        }
      }
  
      // Step 8: Clear the cart
      await queryRunner.manager.delete(this.cartItemRepository.target, { cart: { id: cart.id } });
      await queryRunner.manager.delete(this.cartRepository.target, { id: cart.id });
  
      // Step 9: Commit
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Order creation failed:', error);
      throw new Error(`Order creation failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
  
  

  async findPaymentMethods()  {
    return await this.paymentMethodRepository.find({
      where: {isActive: true}
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

  async findUserOrdes(userId: number) {
    const orders = this.orderRepository.find({
      where: {
        user: {userId}
      }
    })
    return orders;
  }

  async getUserOrderDetails(userId: number,orderId: number) {
    const orderDetails = await this.orderItemRepository.findOne({
      relations: {
        storeItem: {
          item: true,
          store: true,
        },
        storeItemVariation: {
          variation: {
            attributeValues: {
              attribute: true,
              attributeValue: true
            }
          }
        }
      },
      where: {order: {id : orderId,user: {userId}}}
    });
    return {
      orderId: orderDetails.id,
      price: orderDetails.price,
      quantity: orderDetails.quantity,
      subtotal: orderDetails.subtotal,
      storeItem: orderDetails.storeItem,
      // sss: ...orderDetails.storeItemVariation,
      variation: orderDetails.storeItemVariation ? orderDetails.storeItemVariation.variation.attributeValues.map(av => ({
        attributeId: av.attribute.id,
        attributeName: av.attribute.name  || '',
        attributeValue: av.attributeValue.value || '',
        valueId: av.id,
      })) : [],
    }
  }
}
