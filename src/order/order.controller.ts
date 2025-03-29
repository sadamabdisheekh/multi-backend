import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchOrdersDto } from './dto/search_order.Dto';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/createorder')
  async create(
    @Req() req:any,
    @Body() payload: any
  )  {
    const customerId = req.user.id;
    await this.orderService.createOrder(customerId,payload);
    return {message : "order created successfully"};
  }

  @Get('/paymentmethods')
  async findPaymentMethods() {
    return await this.orderService.findPaymentMethods()
  }

  @UseGuards(JwtAuthGuard)
  @Get('/paymentstatuses')
  async findPaymentStatuses() {
    return await this.orderService.findPaymentStatuses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/orderstatuses')
  async findOrderStatuses() {
    return await this.orderService.findOrderStatuses();
  }

  @Post('search')
  async searchOrders(@Body() searchOrdersDto: SearchOrdersDto) {
    return this.orderService.searchOrders(searchOrdersDto);
  }
}
