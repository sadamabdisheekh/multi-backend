import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { SearchOrdersDto } from './dto/search_order.Dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

 
  @Post('/createorder')
  async create(
    @Req() req:any,
    @Body() payload: any
  )  {
    const userId = req.user.userId;
    if (!userId) {
      throw new Error('Customer ID is required to create an order.');
    }

    await this.orderService.createOrder(userId,payload);
    return {message : "order created successfully"};
  }

  @Get('/paymentmethods')
  async findPaymentMethods() {
    return await this.orderService.findPaymentMethods()
  }

  @Get('/paymentstatuses')
  async findPaymentStatuses() {
    return await this.orderService.findPaymentStatuses();
  }

  @Get('/orderstatuses')
  async findOrderStatuses() {
    return await this.orderService.findOrderStatuses();
  }

  @Post('search')
  async searchOrders(@Body() searchOrdersDto: SearchOrdersDto) {
    return this.orderService.searchOrders(searchOrdersDto);
  }

  @Get('/userorders')
  async findUserOrdes(@Req() req: any) {
    return await this.orderService.findUserOrdes(req.user.userId);
  }

  @Get('/userorderdetails')
  async getUserOrderDetails(@Req() req: any,@Query('orderId') orderId: number) {
    return await this.orderService.getUserOrderDetails(req.user.userId,orderId);
  }
}
