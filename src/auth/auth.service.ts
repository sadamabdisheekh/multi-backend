import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }



  async signIn(
    payload: LoginDto
  ): Promise<any> {

    const user = await this.usersService.findByMobileAndPassword(payload.mobile, payload.password);
    
    const { password, ...result } = user as any;
    result.role = 'All';
    result.token = this.jwtService.sign(result,{
      secret: this.configService.get<string>('USER_JWT_SECRET'),
      expiresIn: this.configService.get<string>('USER_TOKEN_EXPIRY'), // Users' tokens expire
    });
    
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
