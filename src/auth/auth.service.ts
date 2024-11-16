import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(
    payload: LoginDto
  ): Promise<any> {

    const user = await this.usersService.findByMobileAndPassword(payload.mobile, payload.password);
    
    const { password, ...result } = user;
    result['role'] = 'All';
    result['token'] = this.jwtService.sign(result);
    
    return result;
  }

  async validateUser(mobile: string, pass: string): Promise<any> {
    const user = await this.usersService.getByMobileAndPass(mobile,pass);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
