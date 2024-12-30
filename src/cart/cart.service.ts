import { Injectable, NotFoundException } from '@nestjs/common';
import { CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) 
    private cartRepository: Repository<Cart>,
    @InjectRepository(Customer) 
    private customerRepository: Repository<Customer>,
    @InjectRepository(CartItem) 
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(StoreItem) 
    private storeItemRepository: Repository<StoreItem>,
  ) {}

  async create(payload: CartDto) {
    const customer = await this.customerRepository.findOne({ where: { id: payload.customerId } });
    if (!customer) {
      throw new NotFoundException(`User with id ${payload.customerId} not found`);
    }
  
    let cart = await this.cartRepository.findOne({ where: { customer: {id : customer.id} } });
    if (!cart) {
      cart = await this.cartRepository.save(this.cartRepository.create({ customer }));
    }
  
    const storeItem = await this.storeItemRepository.findOne({ 
      where: { id: payload.storeItemId } 
    });
    if (!storeItem) {
      throw new NotFoundException(`Store item with id ${payload.storeItemId} not found`);
    }
  
    // Check for an existing cart item for the given store item and variation
    let cartItem = await this.cartItemRepository.findOne({
    where: {
    storeItem: {id: storeItem.id},
    cart: {cart_id: cart.cart_id} },
    });

    if (
      (cartItem && cartItem.quantity > storeItem.availableStock) ||
      (!cartItem && payload.quantity > storeItem.availableStock)
    )
    {
      throw new NotFoundException('Insufficient stock.');
    }
  
    if (cartItem) {
      cartItem.quantity += payload.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        price: payload.price,
        quantity: payload.quantity,
        storeItem: storeItem,
        cart,
      });
    }
  
    return await this.cartItemRepository.save(cartItem);
  }
  

  async findAll(id: number) {
    // Find the user's cart by userId
    const userCart = await this.cartRepository.findOne({
      relations: ['customer'],
      where: {
        customer: { id }
      }
    });
  
  if (!userCart) {
      return [];
    }
  
    const cartItems = await this.cartItemRepository.find({
      relations: ['storeItem.item'],
      where: { cart: { cart_id: userCart.cart_id } } 
    });
  
    return cartItems;
  }
  

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  async incrementItemQuantity(customerId: number,storeItemId: number) {
    const cartItem =  await this.cartItemRepository.findOne({
      relations: ['storeItem'],
      where: {
        storeItem: {id: storeItemId},
        cart: {customer : {id:  customerId}}
      }
    });

    if (!cartItem) {
      throw new NotFoundException(`this cart with store item id ${storeItemId} not found`);
    }

    if (cartItem.quantity > cartItem.storeItem.availableStock) {
      throw new NotFoundException('Insufficient stock.');
    }

    cartItem.quantity += 1;

    return await this.cartItemRepository.save(cartItem);
  }

  async decrementItemQuantity(customerId: number,storeItemId: number) {
    const cartItem =  await this.cartItemRepository.findOne({
      relations: ['storeItem'],
      where: {
        storeItem: {id: storeItemId},
        cart: {customer : {id:  customerId}}
      }
    });

    if (!cartItem) {
      throw new NotFoundException(`this cart with store item id ${storeItemId} not found`);
    }

    cartItem.quantity -= 1;

    return await this.cartItemRepository.save(cartItem);
  }

  async removeCartItem(customerId: number,storeItemId: number) {
    const cartItem =  await this.cartItemRepository.findOne({
      where: {
        storeItem: {id: storeItemId},
        cart: {customer : {id:  customerId}}
      }
    });

    if (!cartItem) {
      throw new NotFoundException(`this cart with store item id ${storeItemId} not found`);
    }


    return await this.cartItemRepository.delete(cartItem.id);
  }
}
