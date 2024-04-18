import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
