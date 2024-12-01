import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UserEntity } from 'src/users/user.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Cart,CartItem,UserEntity,StoreItem
  ])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
