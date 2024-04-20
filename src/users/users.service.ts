import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {
  }

  async create(payload: UserDto) {
    const { firstName, middleName, lastName, mobile, password } = payload;

    const isMobileExists = await this.userRepository.findOne({ where: { mobile: mobile } });

    if (isMobileExists) {
      throw new NotAcceptableException('This mobile number already in use');
    }

    const hashPassword = crypto.createHmac('sha256', password).digest('hex');

    const user = this.userRepository.create({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      datecreated: new Date(),
      mobile: mobile,
      isActive: true,
      password: hashPassword
    })

    const savedUser = await this.userRepository.save(user);

    const userData = {
      userId: savedUser.userId,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      phone: savedUser.mobile,
      accessToken: null
    };
    const accessToken = await this.jwtService.signAsync(userData);
    userData.accessToken = accessToken;
    return userData;

  }

  async findAll() {
    return await this.userRepository.find();
  }


  async findByMobileAndPassword(mobile: string, pass: any) {
    const hashedPassword = crypto.createHmac('sha256', pass).digest('hex');
    return await this.userRepository.findOne({ where: { mobile: mobile, password: hashedPassword } });
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
