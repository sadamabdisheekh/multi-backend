import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, NotAcceptableException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/addtocart')
  async createCart(@Body() createCartDto: CartDto) {
    return await this.cartService.create(createCartDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/getcartitems')
  findAll(@Request() req:any) {
    const customer = req.user;
    if (!customer.id) {
      throw new NotAcceptableException();
    }
    return this.cartService.findAll(customer.id);
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

  @UseGuards(JwtAuthGuard)
  @Get('/incrementquantity/:storeItemId')
  async incrementItemQuantity(@Req() req:any,@Param('storeItemId') storeItemId: number) {
    let customeId = req.user.id;
    return await this.cartService.incrementItemQuantity(customeId,storeItemId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/decrementquantity/:storeItemId')
  async decrementItemQuantity(@Req() req:any,@Param('storeItemId') storeItemId: number) {
    let customeId = req.user.id;
    return await this.cartService.decrementItemQuantity(customeId,storeItemId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/removecartitem/:storeItemId')
  async removeCartItem(@Req() req:any,@Param('storeItemId') storeItemId: number) {
    let customeId = req.user.id;
    const resp = await this.cartService.removeCartItem(customeId,storeItemId)
    return {message: "item removed successfully"};
  }
}
