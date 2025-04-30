import { Controller, Get, Post, Body, UseGuards, Req, Query, BadRequestException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('add')
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/all')
  async findAll(@Query('storeId') storeId: number) {
    if (!storeId || isNaN(storeId)) {
      throw new BadRequestException('Invalid storeId provided.');
    }
    return await this.usersService.findAll(storeId);
  }

  @Get('/user-types')
  async getUserTypes(@Req() req: any) {
    return await this.usersService.getUserTypes(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/permissions')
  async getUserPermissions(@Query('userId') userId: number): Promise<any> {
      const permissions = await this.usersService.getUserPermission(userId);
      return permissions;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-permissions')
  async updateUserPermissions(@Body() body: any) {
    return this.usersService.updateUserPermission(body);
  }

}
