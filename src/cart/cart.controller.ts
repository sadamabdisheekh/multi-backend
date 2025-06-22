import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, NotAcceptableException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/addtocart')
  async createCart(@Body() createCartDto: CartDto,@Request() req:any) {
    return await this.cartService.create(createCartDto,req.user.id);
  }

  @Get('/getcartitems')
  findAll(@Request() req:any) {
    return this.  cartService.findAll(req.user.id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }

  
  @Get('/incrementquantity/:storeItemId')
  async incrementItemQuantity(@Req() req:any,@Param('storeItemId') storeItemId: number) {
    return await this.cartService.incrementItemQuantity(req.user.id,storeItemId)
  }

  @Get('/decrementquantity/:storeItemId')
  async decrementItemQuantity(@Req() req:any,@Param('storeItemId') storeItemId: number) {
    return await this.cartService.decrementItemQuantity(req.user.id,storeItemId)
  }

  @Get('/removecartitem/:storeItemId')
  async removeCartItem(@Req() req:any,@Param('storeItemId') storeItemId: number) {
    const resp = await this.cartService.removeCartItem(req.user.id,storeItemId)
    return {message: "item removed successfully"};
  }
}
