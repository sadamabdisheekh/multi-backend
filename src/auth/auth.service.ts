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
    const { mobile, password } = payload;
    const user = await this.usersService.findByMobileAndPassword(mobile, password);
    if (!user) {
      throw new NotFoundException('invalid mobile or password');
    }

    const userData = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.mobile,
      role: 'All',
      accessToken: null
    };

    // Generate JWT token
    const accessToken = await this.jwtService.signAsync(userData);
    userData.accessToken = accessToken;
    return userData;
  }
}
