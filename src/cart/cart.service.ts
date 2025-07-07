import { Injectable, NotFoundException } from '@nestjs/common';
import { CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { StoreItemVariation } from 'src/stores/entities/store-item-variation.entity';

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
    @InjectRepository(StoreItemVariation) 
    private storeItemVariationRepository: Repository<StoreItemVariation>,
  ) {}

  async create(payload: CartDto,userId: number) {

    let cart = await this.cartRepository.findOne({ where: { user: {userId},store: {id: payload.storeId} } });
    if (!cart) {
      cart = await this.cartRepository.save(this.cartRepository.create({ 
        user: { userId },
        store: { id: payload.storeId },
      }
    ));
    }
  
    const storeItem = await this.storeItemRepository.findOne({ 
      where: { id: payload.storeItemId },
      relations: ['item']
    });
    if (!storeItem) {
      throw new NotFoundException(`Store item with id ${payload.storeItemId} not found`);
    }
  
    let cartItem = await this.cartItemRepository.findOne({
    where: {
    storeItem: {id: storeItem.id},
    storeItemVariation: {id: payload.variationId ? payload.variationId : null},
    cart: {id: cart.id} },
    });
    let availableStock = storeItem.availableStock;

    if (storeItem.item.hasVariations && payload.variationId) {
      const variation = await this.storeItemVariationRepository.findOne({
        where: { id: payload.variationId, storeItem: { id: storeItem.id } },
      });
      if (!variation) {
        throw new NotFoundException(`Variation with id ${payload.variationId} not found for this store item`);
      }
      availableStock = variation.availableStock;
    }

    const requestedQuantity = cartItem ? cartItem.quantity : payload.quantity;

    if (availableStock != null && requestedQuantity > availableStock) {
      throw new NotFoundException('Insufficient stock.');
    }


  
    if (cartItem) {
      cartItem.quantity += payload.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        price: payload.price,
        quantity: payload.quantity,
        storeItem: storeItem,
        storeItemVariation: payload.variationId ? {id: payload.variationId} : null,
        cart,
      });
    }
   
    return await this.cartItemRepository.save(cartItem);
  }
  

  async findAll(userId: number) {
    // Step 1: Get cart
    const userCart = await this.cartRepository.findOne({
      relations: ['user'],
      where: { user: { userId } }
    });
  
    if (!userCart) return [];
  
    // Step 2: Get cart items
    const cartItems = await this.cartItemRepository.find({
      relations: {
        storeItem: { item: true },
        storeItemVariation: {
          variation: {
            attributeValues: {
              attribute: true,
              attributeValue: true
            }
          }
        }
      },
      where: { cart: { id: userCart.id } }
    });
  
    // Step 3: Format result
    const formatted = cartItems.map(item => {
      const variation = item.storeItemVariation?.variation;
      const attributeList = variation?.attributeValues.map(av => ({
        name: av.attribute.name,
        value: av.attributeValue.value,
      })) || [];
  
      const displayName = attributeList.map(a => a.value).join(' - ');
  
      return {
        id: item.id,
        storeItem: item.storeItem,
        quantity: item.quantity,
        price: item.price,
        variation: variation
          ? {
              id: variation.id,
              sku: variation.sku,
              attributes: attributeList,
              displayName,
            }
          : null,
      };
    });
  
    return formatted;
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

  async incrementItemQuantity(userId: number,storeItemId: number) {
    const cartItem =  await this.cartItemRepository.findOne({
      relations: ['storeItem','storeItemVariation'],
      where: {
        storeItem: {id: storeItemId},
        cart: {user : {userId}}
      }
    });

    if (!cartItem) {
      throw new NotFoundException(`this cart with store item id ${storeItemId} not found`);
    }

    const availableStock = cartItem.storeItemVariation?.availableStock ?? cartItem.storeItem.availableStock;

    if (cartItem.quantity >= availableStock) {
      throw new NotFoundException('Insufficient stock.');
    }


    cartItem.quantity += 1;

    return await this.cartItemRepository.save(cartItem);
  }

  async decrementItemQuantity(userId: number,storeItemId: number) {
    const cartItem =  await this.cartItemRepository.findOne({
      relations: ['storeItem'],
      where: {
        storeItem: {id: storeItemId},
        cart: {user : {userId}}
      }
    });

    if (!cartItem) {
      throw new NotFoundException(`this cart with store item id ${storeItemId} not found`);
    }

    cartItem.quantity -= 1;

    return await this.cartItemRepository.save(cartItem);
  }

  async removeCartItem(userId: number,storeItemId: number) {
    const cartItem =  await this.cartItemRepository.findOne({
      where: {
        storeItem: {id: storeItemId},
        cart: {user : {userId}}
      }
    });

    if (!cartItem) {
      throw new NotFoundException(`this cart with store item id ${storeItemId} not found`);
    }


    return await this.cartItemRepository.delete(cartItem.id);
  }
}
