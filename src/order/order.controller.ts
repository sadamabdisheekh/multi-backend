import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';

import { CustomerAuthGuard } from 'src/auth/guards/customer-auth.guard';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';
import { SearchOrdersDto } from './dto/search_order.Dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(CustomerAuthGuard)
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

  @UseGuards(UserAuthGuard)
  @Get('/paymentstatuses')
  async findPaymentStatuses() {
    return await this.orderService.findPaymentStatuses();
  }

  @UseGuards(UserAuthGuard)
  @Get('/orderstatuses')
  async findOrderStatuses() {
    return await this.orderService.findOrderStatuses();
  }

  @Post('search')
  async searchOrders(@Body() searchOrdersDto: SearchOrdersDto) {
    return this.orderService.searchOrders(searchOrdersDto);
  }
}
