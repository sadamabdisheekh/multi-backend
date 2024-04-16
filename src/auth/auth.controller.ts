import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async loginWithPhoneNumberAndPassword(@Body() payload: LoginDto): Promise<any> {

    return await this.authService.signIn(payload);
  }


}
