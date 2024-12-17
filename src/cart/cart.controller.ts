import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, NotAcceptableException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CustomerAuthGuard } from 'src/auth/customer-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/addtocart')
  async createCart(@Body() createCartDto: CartDto) {
    return await this.cartService.create(createCartDto);
  }
  
  @UseGuards(CustomerAuthGuard)
  @Get('/getcartitems')
  findAll(@Request() req) {
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
}
