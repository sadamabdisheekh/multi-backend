import { Injectable, NotFoundException } from '@nestjs/common';
import { CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/user.entity';
import { CartItem } from './entities/cart-item.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) 
    private cartRepository: Repository<Cart>,
    @InjectRepository(UserEntity) 
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CartItem) 
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(StoreItem) 
    private storeItemRepository: Repository<StoreItem>,
  ) {}

  async create(payload: CartDto) {
    const user = await this.userRepository.findOne({ where: { userId: payload.userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${payload.userId} not found`);
    }
  
    let cart = await this.cartRepository.findOne({ where: { user: {userId : user.userId} } });
    if (!cart) {
      cart = await this.cartRepository.save(this.cartRepository.create({ user }));
    }
  
    const storeItem = await this.storeItemRepository.findOne({ 
      relations: ['item','store','itemVariation'],
      where: { id: payload.storeItemId } 
    });
    if (!storeItem) {
      throw new NotFoundException(`Store item with id ${payload.storeItemId} not found`);
    }
  
    // Check for an existing cart item for the given store item and variation
    let cartItem = await this.cartItemRepository.findOne({
      where: { item: {id: storeItem.item.id}, store: {id: storeItem.store.id} },
    });
  
    if (cartItem) {
      cartItem.quantity += payload.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        price: payload.price,
        quantity: payload.quantity,
        item: storeItem.item,
        store: storeItem.store,
        variation: storeItem.itemVariation,
        cart,
      });
    }
  
    await this.cartItemRepository.save(cartItem);
  }
  

  async findAll(id: number) {
    
    const userCart =  await this.cartRepository.findOne({
      relations: ['user'],
      where: {
        user: {userId : id}
      }
    })

    const cartItems  = await this.cartItemRepository.findOne({
      relations: {
        store: true,
        item: true,
        variation: true,
      },
      where: {cart: {cart_id: userCart.cart_id}}
    })

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
}
