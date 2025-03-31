import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as crypto from 'crypto';
import { UserStore } from './user-store.entity';
import { Store } from 'src/stores/entities/store.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(UserStore)
    private readonly userStoreRepository: Repository<UserStore>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {
  }

  async create(payload: UserDto) {
    const { firstName, middleName, lastName, mobile, storeId } = payload;
  
    // Check if the mobile number already exists
    const existingUser = await this.userRepository.findOne({ where: { mobile } });
    if (existingUser) {
      throw new NotAcceptableException('Mobile number already in use.');
    }
  
    // Hash the password
    const hashedPassword = crypto.createHmac('sha256', payload.password).digest('hex');
  
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

    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
  
    // Create and save the user profile
    const userStore = this.userStoreRepository.create({
      user: savedUser,
      store: store ? store : null,
    });
  
    await this.userStoreRepository.save(userStore);
  
    const {password,...result} = savedUser;
    return result;
  }


  async findAll() {
    return await this.userRepository.find({
      relations: ['profile.store']
    });
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
