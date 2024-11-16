import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as crypto from 'crypto';
import { UserProfile } from './user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {
  }

  async create(payload: UserDto) {
    const { firstName, middleName, lastName, mobile, password, storeId } = payload;
  
    // Check if the mobile number already exists
    const existingUser = await this.userRepository.findOne({ where: { mobile } });
    if (existingUser) {
      throw new NotAcceptableException('Mobile number already in use.');
    }
  
    // Hash the password
    const hashedPassword = crypto.createHmac('sha256', password).digest('hex');
  
    // Create and save the user
    const user = this.userRepository.create({
      firstName,
      middleName,
      lastName,
      mobile,
      password: hashedPassword,
      datecreated: new Date(),
      isActive: true,
    });
  
    const savedUser = await this.userRepository.save(user);
  
    // Create and save the user profile
    const userProfile = this.userProfileRepository.create({
      user: savedUser,
      store: { id: storeId },
    });
  
    await this.userProfileRepository.save(userProfile);
  
    return savedUser;
  }
  

  async getByMobileAndPass(
    mobileNumber: string,
    password: string,
  ): Promise<UserEntity> {
    const hashedPassword = crypto.createHmac('sha256', password).digest('hex');

    return this.userRepository.findOne({
      where: {
        mobile: mobileNumber,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return await this.userRepository.find();
  }


  async findByMobileAndPassword(mobile: string, password: string): Promise<any> {
    const hashedPassword = crypto.createHmac('sha256', password).digest('hex');
  
    const user = await this.userRepository.findOne({ where: { mobile, password: hashedPassword } });
    if (!user) {
      throw new NotFoundException('Invalid mobile number or password.');
    }
  
    const userProfile = await this.userProfileRepository.findOne({
      where: { user: {userId: user.userId} },
      relations: ['store'], 
    });
  
    if (userProfile) {
      user['store'] = userProfile.store;
    }
  
    return user;
  }
  

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
