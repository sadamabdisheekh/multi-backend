import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
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
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('/user-types')
  async getUserTypes(@Req() req: any) {
    return await this.usersService.getUserTypes(req.user);
  }

}
