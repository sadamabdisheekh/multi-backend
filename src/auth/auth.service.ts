import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }



  async signIn(
    payload: LoginDto
  ): Promise<any> {

    const user = await this.usersService.findByMobileAndPassword(payload);
    const { password, ...result } = user as any;
    result.token = this.jwtService.sign(result,{
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRY, // Users' tokens expire
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
